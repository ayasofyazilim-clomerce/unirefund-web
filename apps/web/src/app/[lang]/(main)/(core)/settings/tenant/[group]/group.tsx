"use client";
import type {
  UniRefund_AdministrationService_CountrySettings_SetCountrySettingsByListDto as SetCountrySettingsByListDto,
  UniRefund_AdministrationService_CountrySettings_CountrySettingDto as CountrySettingDto,
  UniRefund_AdministrationService_Items_GroupItemDto as GroupItemDto,
} from "@ayasofyazilim/core-saas/AdministrationService";
import {createZodObject} from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import AutoForm, {AutoFormSubmit} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import {TabLayout} from "@repo/ayasofyazilim-ui/templates/tab-layout";
import {notFound, useParams, useRouter} from "next/navigation";
import {handlePutResponse} from "@repo/utils/api";
import {putCountrySettingsApi} from "@repo/actions/core/AdministrationService/put-actions";
import type {AdministrationServiceResource} from "src/language-data/core/AdministrationService";
import {createDependencies, createFieldConfig, createSchema} from "./_components/utils";

export default function TenantSettingsPage({
  list,
  languageData,
}: {
  list: CountrySettingDto;
  languageData: AdministrationServiceResource;
}) {
  const router = useRouter();
  const {group} = useParams<{group: string}>();
  const activeGroup = list.groups.find((x) => x.key === group) || list.groups.at(0);
  if (!activeGroup) return notFound();

  const schema = createSchema(activeGroup);
  const formSchema = createZodObject(schema, activeGroup.items?.map((item: GroupItemDto) => item.key) || []);
  const fieldConfig = createFieldConfig(activeGroup, languageData);
  const dependencies = createDependencies(activeGroup);
  const tabList = createTabListFromList(list, languageData);
  return (
    <TabLayout orientation="vertical" tabList={tabList}>
      <AutoForm
        className="w-full"
        dependencies={dependencies}
        fieldConfig={fieldConfig}
        formSchema={formSchema}
        onSubmit={(data) => {
          const manupulatedData = {
            countrySettings: Object.keys(data).map((key) => {
              return {
                key,
                value: (data[key] as string).toString(),
              };
            }),
          };

          void putCountrySettingsApi(manupulatedData as SetCountrySettingsByListDto).then((response) => {
            handlePutResponse(response, router);
          });
        }}
        stickyChildren>
        <AutoFormSubmit className="float-right" />
      </AutoForm>
    </TabLayout>
  );
}

function createTabListFromList(list: CountrySettingDto, languageData: AdministrationServiceResource) {
  return list.groups.map((item) => {
    return {
      label: languageData[item.displayName as keyof typeof languageData] || item.displayName,
      href: item.key,
    };
  });
}
