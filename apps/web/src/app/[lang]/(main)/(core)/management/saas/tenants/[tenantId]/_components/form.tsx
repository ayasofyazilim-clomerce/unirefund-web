"use client";

import type {Volo_Saas_Host_Dtos_SaasTenantDto} from "@ayasofyazilim/core-saas/SaasService";
import type {Volo_Abp_LanguageManagement_Dto_LanguageDto} from "@ayasofyazilim/saas/AdministrationService";
import type {
  UniRefund_LocationService_Countries_CountryDto,
  UniRefund_LocationService_Currencies_CurrencyDto,
} from "@ayasofyazilim/saas/LocationService";
import type {Volo_Saas_Host_Dtos_EditionDto} from "@ayasofyazilim/saas/SaasService";
import {$UniRefund_SaasService_Tenants_SaasTenantCustomUpdateDto} from "@ayasofyazilim/saas/SaasService";
import type {Volo_Abp_NameValue} from "@ayasofyazilim/saas/SettingService";
import ConfirmDialog from "@repo/ayasofyazilim-ui/molecules/confirm-dialog";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {DependencyType} from "@repo/ayasofyazilim-ui/organisms/schema-form/types";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import {ActionList} from "@repo/ui/action-button";
import {handleDeleteResponse, handlePutResponse} from "@repo/utils/api";
import {isActionGranted, useGrantedPolicies} from "@repo/utils/policies";
import {Trash2} from "lucide-react";
import {useRouter} from "next/navigation";
import {useTransition} from "react";
import {putTenantApi} from "@/actions/core/SaasService/put-actions";
import {deleteTenantByIdApi} from "@/actions/core/SaasService/delete-actions";
import type {SaasServiceResource} from "src/language-data/core/SaasService";

export default function Page({
  languageData,
  editionList,
  languageList,
  countryList,
  currencyList,
  timezoneList,
  tenantDetailsData,
}: {
  languageData: SaasServiceResource;
  editionList: Volo_Saas_Host_Dtos_EditionDto[];
  languageList: Volo_Abp_LanguageManagement_Dto_LanguageDto[];
  countryList: UniRefund_LocationService_Countries_CountryDto[];
  currencyList: UniRefund_LocationService_Currencies_CurrencyDto[];
  timezoneList: Volo_Abp_NameValue[];
  tenantDetailsData: Volo_Saas_Host_Dtos_SaasTenantDto;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {grantedPolicies} = useGrantedPolicies();

  const uiSchema = createUiSchemaWithResource({
    schema: $UniRefund_SaasService_Tenants_SaasTenantCustomUpdateDto,
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
    <div className="flex flex-col gap-4 overflow-auto">
      <ActionList>
        {isActionGranted(["Saas.Tenants.Delete"], grantedPolicies) && (
          <ConfirmDialog
            closeProps={{
              children: languageData.Cancel,
            }}
            confirmProps={{
              variant: "destructive",
              children: languageData.Delete,
              onConfirm: () => {
                startTransition(() => {
                  void deleteTenantByIdApi(tenantDetailsData.id || "").then((res) => {
                    handleDeleteResponse(res, router, "../tenants");
                  });
                });
              },
              closeAfterConfirm: true,
            }}
            description={languageData["Delete.Assurance"]}
            title={languageData["Tenant.Delete"]}
            triggerProps={{
              children: (
                <>
                  <Trash2 className="mr-2 w-4" /> {languageData.Delete}
                </>
              ),
              variant: "outline",
              disabled: isPending,
            }}
            type="with-trigger"
          />
        )}
      </ActionList>
      <SchemaForm<Volo_Saas_Host_Dtos_SaasTenantDto>
        className="flex flex-col gap-4"
        disabled={isPending}
        filter={{
          type: "include",
          sort: true,
          keys: [
            "name",
            "editionId",
            "activationState",
            "activationEndDate",
            "countryCode3",
            "defaultLanguage",
            "currency",
            "timeZone",
          ],
        }}
        formData={tenantDetailsData}
        onSubmit={({formData}) => {
          startTransition(() => {
            void putTenantApi({
              id: tenantDetailsData.id || "",
              requestBody: {...formData, name: tenantDetailsData.name || ""},
            }).then((res) => {
              handlePutResponse(res, router, "../tenants");
            });
          });
        }}
        schema={$UniRefund_SaasService_Tenants_SaasTenantCustomUpdateDto}
        submitText={languageData["Edit.Save"]}
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
    </div>
  );
}
