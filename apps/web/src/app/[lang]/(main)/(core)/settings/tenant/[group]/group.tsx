"use client";
import type {UniRefund_AdministrationService_CountrySettings_CountrySettingDto as CountrySettingDto} from "@ayasofyazilim/saas/AdministrationService";
import {putCountrySettingsApi} from "@repo/actions/unirefund/AdministrationService/put-actions";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {TabLayout} from "@repo/ayasofyazilim-ui/templates/tab-layout";
import {cn} from "@repo/ui/utils";
import {handlePutResponse} from "@repo/utils/api";
import {notFound, useParams, useRouter} from "next/navigation";
import {useTransition} from "react";
import type {AdministrationServiceResource} from "src/language-data/core/AdministrationService";
import {createSchema, createUiSchema} from "./_components/schema";
import {createTabListFromList, manupulatedData} from "./_components/utils";

export default function TenantSettingsPage({
  list,
  languageData,
}: {
  list: CountrySettingDto;
  languageData: AdministrationServiceResource;
}) {
  const router = useRouter();
  const {group, lang} = useParams<{group: string; lang: string}>();
  const [isPending, startTransition] = useTransition();
  const activeGroup = list.groups.find((x) => x.key === group) || list.groups.at(0);
  if (!activeGroup) return notFound();
  const $schema = createSchema({group: activeGroup, languageData});
  const uiSchema = createUiSchema({group: activeGroup});
  const tabList = createTabListFromList(list, languageData);
  return (
    <TabLayout orientation="vertical" tabList={tabList}>
      <SchemaForm
        className={cn("max-w-lg", activeGroup.items && activeGroup.items.length > 5 && "max-w-3xl")}
        defaultSubmitClassName="justify-start [&>button]:w-full"
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
    </TabLayout>
  );
}
