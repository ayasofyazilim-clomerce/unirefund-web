"use client";
import {useState, useTransition} from "react";
import type {
  UniRefund_AdministrationService_CountrySettings_CountrySettingDto as CountrySettingDto,
  UniRefund_AdministrationService_Groups_GroupDto,
} from "@ayasofyazilim/saas/AdministrationService";
import {putCountrySettingsApi} from "@repo/actions/unirefund/AdministrationService/put-actions";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {cn} from "@repo/ui/utils";
import {handlePutResponse} from "@repo/utils/api";
import {useParams, useRouter} from "next/navigation";
import type {AdministrationServiceResource} from "src/language-data/core/AdministrationService";
import {createSchema, createUiSchema} from "./_components/schema";
import {manupulatedData} from "./_components/utils";
import {description} from "./_components/description";

export default function TenantSettingsPage({
  list,
  languageData,
}: {
  list: CountrySettingDto;
  languageData: AdministrationServiceResource;
}) {
  const [activeTab, setActiveTab] = useState<string>(list.groups[0].key);
  const activeGroup = list.groups.find((group) => group.key === activeTab);

  return (
    <div className="flex h-full w-full flex-col">
      {/* Header */}
      {/* <div className="bg-white px-4 sm:px-6 pt-6 pb-4 border-b">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 truncate">Tenant Settings</h1>
        <p className="text-gray-500 mt-1 text-sm sm:text-base break-words">Configure your tenant settings and preferences</p>
      </div> */}

      <div className="flex h-full w-full flex-col gap-4 p-4 sm:gap-6 sm:p-6 lg:flex-row">
        {/* Sidebar */}
        <div className="w-full rounded-lg border bg-white shadow-sm lg:w-1/4">
          <div className="border-b p-3 sm:p-4">
            <h2 className="text-sm font-medium text-gray-800 sm:text-base">Setting Groups</h2>
          </div>
          <nav className="flex flex-col p-2">
            {list.groups.map((tab, index) => (
              <button
                className={cn(
                  "break-words rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors sm:px-4 sm:py-3 sm:text-sm",
                  activeTab === tab.key ? "bg-primary/10 text-primary" : "text-gray-700 hover:bg-gray-100",
                )}
                data-testid={`tab-${index}`}
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                }}
                type="button">
                <div className="flex items-center">
                  <span className="line-clamp-2">
                    {languageData[tab.displayName as keyof typeof languageData] || tab.displayName}
                  </span>
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 rounded-lg border bg-white shadow-sm">
          {activeGroup ? (
            <>
              <div className="border-b p-4">
                <h2 className="break-words text-base font-semibold text-gray-900 sm:text-lg">
                  {languageData[activeGroup.displayName as keyof typeof languageData] || activeGroup.displayName}
                </h2>
                {activeGroup.description ? (
                  <div className="mt-1 text-xs sm:text-sm">
                    {description(
                      languageData[activeGroup.description as keyof typeof languageData] || activeGroup.description,
                    )}
                  </div>
                ) : null}
              </div>
              <div className="p-4 sm:p-6">
                <Content group={activeGroup} languageData={languageData} />
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Content({
  group,
  languageData,
}: {
  group: UniRefund_AdministrationService_Groups_GroupDto;
  languageData: AdministrationServiceResource;
}) {
  const router = useRouter();
  const {lang} = useParams<{lang: string}>();
  const [isPending, startTransition] = useTransition();
  const $schema = createSchema({group, languageData});
  const uiSchema = createUiSchema({group});

  return (
    <SchemaForm
      className={cn("w-full text-sm sm:text-base")}
      defaultSubmitClassName="justify-end mt-6"
      disableValidation
      disabled={isPending}
      id="tenant-settings-form"
      locale={lang}
      onSubmit={({formData}) => {
        if (!formData) return;
        const requestBody = manupulatedData(formData);
        startTransition(() => {
          void putCountrySettingsApi(requestBody).then((response) => {
            handlePutResponse(response, router);
          });
        });
      }}
      schema={$schema}
      uiSchema={uiSchema}
    />
  );
}
