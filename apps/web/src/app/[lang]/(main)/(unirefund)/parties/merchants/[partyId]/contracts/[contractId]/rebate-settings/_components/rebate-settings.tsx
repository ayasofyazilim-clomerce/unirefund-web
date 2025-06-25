"use client";

import {
  $UniRefund_ContractService_Rebates_RebateSettings_RebateSettingUpSertDto as $RebateSettingUpSertDto,
  type UniRefund_ContractService_Rebates_RebateTableHeaders_RebateTableHeaderInformationDto as AssignableRebateTableHeaders,
  type UniRefund_ContractService_Rebates_RebateSettings_RebateSettingDto as RebateSettingDto,
  type UniRefund_ContractService_Rebates_RebateSettings_RebateSettingUpSertDto as RebateSettingUpSertDto,
} from "@ayasofyazilim/saas/ContractService";
import type {
  UniRefund_CRMService_AffiliationTypes_AffiliationTypeDetailDto as AffiliationTypeDetailDto,
  UniRefund_CRMService_Merchants_StoreProfileDto as StoreProfileDto,
} from "@ayasofyazilim/saas/CRMService";
import {postMerchantContractHeaderRebateSettingByHeaderIdApi} from "@repo/actions/unirefund/ContractService/post-actions";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import {handlePostResponse} from "@repo/utils/api";
import {isActionGranted, useGrantedPolicies} from "@repo/utils/policies";
import {useRouter} from "next/navigation";
import {useTransition} from "react";
import type {ContractServiceResource} from "src/language-data/unirefund/ContractService";

export function RebateSettings({
  languageData,
  rebateSettings,
  rebateTableHeaders,
  subMerchants,
  individuals,
  contractId,
}: {
  languageData: ContractServiceResource;
  rebateSettings: RebateSettingDto | undefined;
  rebateTableHeaders: AssignableRebateTableHeaders[];
  subMerchants: StoreProfileDto[];
  individuals: AffiliationTypeDetailDto[];
  contractId: string;
}) {
  const router = useRouter();
  const {grantedPolicies} = useGrantedPolicies();
  const [isPending, startTransition] = useTransition();
  const uiSchema = createUiSchemaWithResource({
    schema: $RebateSettingUpSertDto,
    resources: languageData,
    name: "Rebate.Form",
    extend: {
      isTrustedMerchant: {
        "ui:widget": "switch",
      },
      contactInformationTypeId: {
        "ui:widget": "Individuals",
      },
      minimumNetCommissions: {
        items: {
          appliedOrganizationId: {
            "ui:widget": "subMerchants",
          },
        },
      },
      rebateTableHeaders: {
        items: {
          rebateTableHeaderId: {
            "ui:widget": "rebateTableHeader",
          },
        },
      },
    },
  });

  const hasEditPermission = isActionGranted(
    ["ContractService.ContractHeaderForMerchant.UpSertRebateSetting"],
    grantedPolicies,
  );

  return (
    <SchemaForm<RebateSettingUpSertDto>
      disabled={!hasEditPermission || isPending}
      formData={
        rebateSettings
          ? {
              ...rebateSettings,
              rebateTableHeaders: rebateSettings.rebateTableHeaders?.map((rebateTableHeader) => ({
                ...rebateTableHeader,
                rebateTableHeaderId: rebateTableHeader.id,
              })),
            }
          : undefined
      }
      onSubmit={({formData: editedFormData}) => {
        if (!editedFormData) return;
        startTransition(() => {
          void postMerchantContractHeaderRebateSettingByHeaderIdApi({
            id: contractId,
            requestBody: editedFormData,
          }).then((res) => {
            handlePostResponse(res, router);
          });
        });
      }}
      schema={$RebateSettingUpSertDto}
      uiSchema={uiSchema}
      useTableForArrayItems
      widgets={{
        Individuals: CustomComboboxWidget<AffiliationTypeDetailDto>({
          languageData,
          selectLabel: "name",
          selectIdentifier: "id",
          list: individuals,
          badges: {
            codeName: {
              className: "",
            },
          },
        }),
        rebateTableHeader: CustomComboboxWidget<AssignableRebateTableHeaders>({
          list: rebateTableHeaders,
          languageData,
          selectIdentifier: "id",
          selectLabel: "name",
        }),
        subMerchants: CustomComboboxWidget<StoreProfileDto>({
          list: subMerchants,
          languageData,
          selectIdentifier: "id",
          selectLabel: "name",
        }),
      }}
    />
  );
}
