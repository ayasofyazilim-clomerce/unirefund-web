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
    <Tabs className="flex h-full gap-4 pb-4" defaultValue={list.groups[0].key}>
      <TabsList className="my-6 flex h-auto w-1/3 flex-col justify-start rounded-md border bg-transparent p-6">
        {list.groups.map((tab) => (
          <TabsTrigger
            className="hover:bg-muted/30 data-[state=active]:bg-muted w-full justify-start text-wrap text-left data-[state=active]:font-medium md:text-nowrap"
            key={tab.key}
            value={tab.key}>
            {languageData[tab.displayName as keyof typeof languageData] || tab.displayName}
          </TabsTrigger>
        ))}
      </TabsList>

      {list.groups.map((tab) => (
        <TabsContent
          className="relative my-6 h-auto w-2/3 rounded-md border bg-transparent p-6"
          key={tab.key}
          value={tab.key}>
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
      className={cn("mx-auto w-full max-w-3xl rounded-md border p-2 shadow-md md:p-6")}
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
