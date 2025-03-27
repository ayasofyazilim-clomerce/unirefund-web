"use client";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import type {
  UniRefund_AdministrationService_CountrySettings_CountrySettingDto as CountrySettingDto,
  UniRefund_AdministrationService_Groups_GroupDto,
} from "@ayasofyazilim/saas/AdministrationService";
import {putCountrySettingsApi} from "@repo/actions/unirefund/AdministrationService/put-actions";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {cn} from "@repo/ui/utils";
import {handlePutResponse} from "@repo/utils/api";
import {useParams, useRouter} from "next/navigation";
import {useTransition} from "react";
import type {AdministrationServiceResource} from "src/language-data/core/AdministrationService";
import {createSchema, createUiSchema} from "./_components/schema";
import {manupulatedData} from "./_components/utils";

export default function TenantSettingsPage({
  list,
  languageData,
}: {
  list: CountrySettingDto;
  languageData: AdministrationServiceResource;
}) {
  return (
    <Tabs className="flex h-full gap-2 pb-4" defaultValue={list.groups[0].key}>
      <TabsList className="flex h-full flex-col justify-start">
        {list.groups.map((tab) => (
          <TabsTrigger
            className="w-full justify-start text-wrap text-left md:text-nowrap"
            key={tab.key}
            value={tab.key}>
            {languageData[tab.displayName as keyof typeof languageData] || tab.displayName}
          </TabsTrigger>
        ))}
      </TabsList>

      {list.groups.map((tab) => (
        <TabsContent className="relative m-0 w-full max-w-3xl rounded-md" key={tab.key} value={tab.key}>
          <Content group={tab} languageData={languageData} />
        </TabsContent>
      ))}
    </Tabs>
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
      className={cn("w-full max-w-3xl")}
      defaultSubmitClassName="justify-start [&>button]:w-full pb-0"
      disableValidation
      disabled={isPending}
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
