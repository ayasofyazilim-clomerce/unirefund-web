"use client";

import type {Volo_Abp_LanguageManagement_Dto_LanguageDto} from "@ayasofyazilim/saas/AdministrationService";
import type {
  UniRefund_LocationService_Countries_CountryDto,
  UniRefund_LocationService_Currencies_CurrencyDto,
} from "@ayasofyazilim/saas/LocationService";
import type {
  UniRefund_SaasService_Tenants_SaasTenantCustomCreateDto,
  Volo_Saas_Host_Dtos_EditionDto,
} from "@ayasofyazilim/saas/SaasService";
import {$UniRefund_SaasService_Tenants_SaasTenantCustomCreateDto} from "@ayasofyazilim/saas/SaasService";
import type {Volo_Abp_NameValue} from "@ayasofyazilim/saas/SettingService";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {DependencyType} from "@repo/ayasofyazilim-ui/organisms/schema-form/types";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import {handlePostResponse} from "@repo/utils/api";
import {useRouter} from "next/navigation";
import {useTransition} from "react";
import {postTenantApi} from "src/actions/core/SaasService/post-actions";
import type {SaasServiceResource} from "src/language-data/core/SaasService";

export default function Page({
  languageData,
  editionList,
  languageList,
  countryList,
  currencyList,
  timezoneList,
}: {
  languageData: SaasServiceResource;
  editionList: Volo_Saas_Host_Dtos_EditionDto[];
  languageList: Volo_Abp_LanguageManagement_Dto_LanguageDto[];
  countryList: UniRefund_LocationService_Countries_CountryDto[];
  currencyList: UniRefund_LocationService_Currencies_CurrencyDto[];
  timezoneList: Volo_Abp_NameValue[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const uiSchema = createUiSchemaWithResource({
    schema: $UniRefund_SaasService_Tenants_SaasTenantCustomCreateDto,
    resources: languageData,
    name: "Form.Tenant",
    extend: {
      "ui:className": "md:grid md:grid-cols-2 md:gap-2",
      adminPassword: {
        "ui:widget": "password",
      },
      adminEmailAddress: {
        "ui:widget": "email",
      },
      editionId: {
        "ui:widget": "editionWidget",
      },
      countryCode3: {
        "ui:widget": "countryWidget",
      },
      defaultLanguage: {
        "ui:widget": "languageWidget",
      },
      currency: {
        "ui:widget": "currencyWidget",
      },
      timeZone: {
        "ui:widget": "timeZoneWidget",
      },
      activationEndDate: {
        dependencies: [
          {
            target: "activationState",
            type: DependencyType.HIDES,
            when: (activationState: number) => activationState !== 1,
          },
          {
            target: "activationState",
            type: DependencyType.REQUIRES,
            when: (activationState: number) => activationState === 1,
          },
        ],
      },
    },
  });

  return (
    <SchemaForm<UniRefund_SaasService_Tenants_SaasTenantCustomCreateDto>
      className="flex flex-col gap-4"
      disabled={isPending}
      filter={{
        type: "include",
        sort: true,
        keys: [
          "name",
          "editionId",
          "adminEmailAddress",
          "adminPassword",
          "activationState",
          "activationEndDate",
          "countryCode3",
          "defaultLanguage",
          "currency",
          "timeZone",
        ],
      }}
      onSubmit={({formData}) => {
        startTransition(() => {
          void postTenantApi({
            requestBody: formData,
          }).then((res) => {
            handlePostResponse(res, router, "../tenants");
          });
        });
      }}
      schema={$UniRefund_SaasService_Tenants_SaasTenantCustomCreateDto}
      submitText={languageData.Save}
      uiSchema={uiSchema}
      useDependency
      widgets={{
        editionWidget: CustomComboboxWidget<Volo_Saas_Host_Dtos_EditionDto>({
          languageData,
          list: editionList,
          selectIdentifier: "id",
          selectLabel: "displayName",
        }),
        countryWidget: CustomComboboxWidget<UniRefund_LocationService_Countries_CountryDto>({
          languageData,
          list: countryList,
          selectIdentifier: "code3",
          selectLabel: "name",
        }),
        languageWidget: CustomComboboxWidget<Volo_Abp_LanguageManagement_Dto_LanguageDto>({
          languageData,
          list: languageList,
          selectIdentifier: "cultureName",
          selectLabel: "displayName",
        }),
        currencyWidget: CustomComboboxWidget<UniRefund_LocationService_Currencies_CurrencyDto>({
          languageData,
          list: currencyList,
          selectIdentifier: "code",
          selectLabel: "code",
        }),
        timeZoneWidget: CustomComboboxWidget<Volo_Abp_NameValue>({
          languageData,
          list: timezoneList,
          selectIdentifier: "value",
          selectLabel: "name",
        }),
      }}
    />
  );
}
