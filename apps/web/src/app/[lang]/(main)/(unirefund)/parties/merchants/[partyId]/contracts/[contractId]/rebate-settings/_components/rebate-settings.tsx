"use client";

import {
  $UniRefund_ContractService_Rebates_RebateSettings_RebateSettingUpSertDto as $RebateSettingUpSertDto,
  type UniRefund_ContractService_Rebates_RebateTableHeaders_RebateTableHeaderInformationDto as AssignableRebateTableHeaders,
  type UniRefund_ContractService_Rebates_RebateSettings_RebateSettingDto as RebateSettingDto,
  type UniRefund_ContractService_Rebates_RebateSettings_RebateSettingUpSertDto as RebateSettingUpSertDto,
} from "@repo/saas/ContractService";
import type {
  UniRefund_CRMService_Affiliations_AffiliationListResponseDto,
  UniRefund_CRMService_Merchants_MerchantDto,
} from "@repo/saas/CRMService";
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
  subMerchants: UniRefund_CRMService_Merchants_MerchantDto[];
  individuals: UniRefund_CRMService_Affiliations_AffiliationListResponseDto[];
  contractId: string;
}) {
  const router = useRouter();
  const {grantedPolicies} = useGrantedPolicies();
  const [isPending, startTransition] = useTransition();
  const uiSchema = createUiSchemaWithResource({
    schema: $RebateSettingUpSertDto,
    resources: languageData,
    name: "Contracts.Form",
    extend: {
      isTrustedMerchant: {
        "ui:widget": "switch",
      },
      affiliationIdForContact: {
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
          : {
              referenceNumber: "0",
              rebateStatementPeriod: "None",
              affiliationIdForContact: individuals[0]?.id || "",
              rebateTableHeaders: [
                {
                  rebateTableHeaderId: rebateTableHeaders[0].id,
                  validFrom: new Date().toISOString(),
                },
              ],
            }
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
        Individuals: CustomComboboxWidget<UniRefund_CRMService_Affiliations_AffiliationListResponseDto>({
          languageData,
          selectLabel: "name",
          selectIdentifier: "id",
          list: individuals,
          badges: {
            roleName: {
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
        subMerchants: CustomComboboxWidget<UniRefund_CRMService_Merchants_MerchantDto>({
          list: subMerchants,
          languageData,
          selectIdentifier: "id",
          selectLabel: "name",
        }),
      }}
    />
  );
}
