"use client";

import {
  $UniRefund_ContractService_Rebates_MinimumNetCommissions_MinimumNetCommissionUpSertDto as $MinimumNetCommissionUpSertDto,
  $UniRefund_ContractService_Rebates_RebateSettings_RebateSettingUpSertDto as $RebateSettingUpSertDto,
  $UniRefund_ContractService_Rebates_RebateTableHeaders_RebateTableHeadersToRebateSettingUpSertDto as $RebateTableHeadersToRebateSettingUpSertDto,
  type UniRefund_ContractService_Rebates_RebateTableHeaders_RebateTableHeaderInformationDto as AssignableRebateTableHeaders,
  type UniRefund_ContractService_Rebates_MinimumNetCommissions_MinimumNetCommissionUpSertDto as MinimumNetCommissionUpSertDto,
  type UniRefund_ContractService_Rebates_RebateSettings_RebateSettingDto as RebateSettingDto,
  type UniRefund_ContractService_Rebates_RebateSettings_RebateSettingUpSertDto as RebateSettingUpSertDto,
  type UniRefund_ContractService_Rebates_RebateTableHeaders_RebateTableHeadersToRebateSettingUpSertDto as RebateTableHeadersToRebateSettingUpSertDto,
} from "@ayasofyazilim/saas/ContractService";
import type {
  UniRefund_CRMService_AffiliationTypes_AffiliationTypeDetailDto as AffiliationTypeDetailDto,
  UniRefund_CRMService_Merchants_StoreProfileDto as StoreProfileDto,
} from "@ayasofyazilim/saas/CRMService";
import {postMerchantContractHeaderRebateSettingByHeaderIdApi} from "@repo/actions/unirefund/ContractService/post-actions";
import {tanstackTableEditableColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {TableField} from "@repo/ayasofyazilim-ui/organisms/schema-form/fields";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import {handlePostResponse} from "@repo/utils/api";
import {PlusCircle} from "lucide-react";
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
  const [isPending, startTransition] = useTransition();
  const uiSchema = createUiSchemaWithResource({
    schema: $RebateSettingUpSertDto,
    resources: languageData,
    name: "Rebate.Form",
    extend: {
      isTrustedMerchant: {
        "ui:widget": "switch",
      },
      rebateTableHeaders: {
        "ui:field": "RebateTableField",
      },
      contactInformationTypeId: {
        "ui:widget": "Individuals",
      },
      minimumNetCommissions: {
        "ui:field": "MinimumNetCommissionsField",
      },
    },
  });

  const rebateTableFormData = rebateSettings?.rebateTableHeaders?.map((rebateTableHeader) => {
    const validFrom = new Date(rebateTableHeader.validFrom);
    validFrom.setUTCHours(0, 0, 0, 0);
    const validTo = rebateTableHeader.validTo ? new Date(rebateTableHeader.validTo) : undefined;
    validTo?.setUTCHours(0, 0, 0, 0);
    return {
      ...rebateTableHeader,
      validFrom: validFrom.toISOString(),
      validTo: validTo ? validTo.toISOString() : undefined,
      rebateTableHeaderId: rebateTableHeader.id,
    };
  });

  const minimumNetCommissionsFormData = rebateSettings?.minimumNetCommissions?.map((minimumNetCommission) => {
    const validFrom = new Date(minimumNetCommission.validFrom);
    validFrom.setUTCHours(0, 0, 0, 0);
    const validTo = minimumNetCommission.validTo ? new Date(minimumNetCommission.validTo) : undefined;
    validTo?.setUTCHours(0, 0, 0, 0);
    return {
      ...minimumNetCommission,
      validFrom: validFrom.toISOString(),
      validTo: validTo ? validTo.toISOString() : undefined,
    };
  });

  return (
    <SchemaForm<RebateSettingUpSertDto>
      disabled={isPending}
      fields={{
        RebateTableField: RebateTableField(rebateTableFormData, languageData, rebateTableHeaders),
        MinimumNetCommissionsField: MinimumNetCommissionsField(
          minimumNetCommissionsFormData,
          languageData,
          subMerchants,
        ),
      }}
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
      }}
    />
  );
}

function RebateTableField(
  formData: RebateTableHeadersToRebateSettingUpSertDto[] | undefined | null,
  languageData: ContractServiceResource,
  refundTableHeaders: AssignableRebateTableHeaders[],
) {
  return TableField<RebateTableHeadersToRebateSettingUpSertDto>({
    editable: true,
    fillerColumn: "rebateTableHeaderId",
    data: formData || [],
    columns: tanstackTableEditableColumnsByRowData<RebateTableHeadersToRebateSettingUpSertDto>({
      rows: {
        ...$RebateTableHeadersToRebateSettingUpSertDto.properties,
        rebateTableHeaderId: {
          ...$RebateTableHeadersToRebateSettingUpSertDto.properties.rebateTableHeaderId,
          enum: refundTableHeaders.map((x) => ({
            value: x.id,
            label: x.name,
          })),
        },
      },
      excludeColumns: ["extraProperties"],
    }),
    tableActions: [
      {
        type: "create-row",
        actionLocation: "table",
        cta: languageData.New,
        icon: PlusCircle,
      },
    ],
    rowActions: [
      {
        actionLocation: "row",
        cta: languageData.Delete,
        type: "delete-row",
      },
    ],
  });
}

function MinimumNetCommissionsField(
  formData: MinimumNetCommissionUpSertDto[] | undefined | null,
  languageData: ContractServiceResource,
  subMerchants: StoreProfileDto[],
) {
  return TableField<MinimumNetCommissionUpSertDto>({
    editable: true,
    fillerColumn: "appliedOrganizationId",
    data: formData || [],
    columns: tanstackTableEditableColumnsByRowData<MinimumNetCommissionUpSertDto>({
      languageData,
      rows: {
        ...$MinimumNetCommissionUpSertDto.properties,
        appliedOrganizationId: {
          ...$MinimumNetCommissionUpSertDto.properties.appliedOrganizationId,
          enum: subMerchants.map((x) => ({
            value: x.id,
            label: x.name,
          })),
        },
      },
      excludeColumns: ["extraProperties"],
    }),
    tableActions: [
      {
        type: "create-row",
        actionLocation: "table",
        cta: languageData.New,
        icon: PlusCircle,
      },
    ],
    rowActions: [
      {
        actionLocation: "row",
        cta: languageData.Delete,
        type: "delete-row",
      },
    ],
    columnOrder: ["appliedOrganizationId", "amount", "validFrom", "validTo"],
  });
}
