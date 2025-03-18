"use client";

import {
  $UniRefund_ContractService_Rebates_RebateSettings_RebateSettingUpSertDto as $RebateSettingUpSertDto,
  $UniRefund_ContractService_Rebates_RebateTableHeaders_RebateTableHeadersToRebateSettingUpSertDto as $RebateTableHeadersToRebateSettingUpSertDto,
  $UniRefund_ContractService_Rebates_MinimumNetCommissions_MinimumNetCommissionUpSertDto as $MinimumNetCommissionUpSertDto,
  type UniRefund_ContractService_Rebates_RebateTableHeaders_RebateTableHeaderInformationDto as AssignableRebateTableHeaders,
  type UniRefund_ContractService_Rebates_RebateSettings_RebateSettingDto as RebateSettingDto,
  type UniRefund_ContractService_Rebates_RebateSettings_RebateSettingUpSertDto as RebateSettingUpSertDto,
  type UniRefund_ContractService_Rebates_RebateTableHeaders_RebateTableHeadersToRebateSettingUpSertDto as RebateTableHeadersToRebateSettingUpSertDto,
  type UniRefund_ContractService_Rebates_MinimumNetCommissions_MinimumNetCommissionUpSertDto as MinimumNetCommissionUpSertDto,
} from "@ayasofyazilim/saas/ContractService";
import type {
  UniRefund_CRMService_AffiliationTypes_AffiliationTypeDetailDto as AffiliationTypeDetailDto,
  UniRefund_CRMService_Merchants_StoreProfileDto as StoreProfileDto,
} from "@ayasofyazilim/saas/CRMService";
import {tanstackTableEditableColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {TableField} from "@repo/ayasofyazilim-ui/organisms/schema-form/fields";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import {PlusCircle} from "lucide-react";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {handlePostResponse} from "@repo/utils/api";
import {postMerchantContractHeaderRebateSettingByHeaderIdApi} from "@repo/actions/unirefund/ContractService/post-actions";
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
  const [loading, setLoading] = useState(false);
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

  const rebateTableFormData = rebateSettings?.rebateTableHeaders?.map((rebateTableHeader) => ({
    ...rebateTableHeader,
    rebateTableHeaderId: rebateTableHeader.id,
  }));

  return (
    <SchemaForm<RebateSettingUpSertDto>
      disabled={loading}
      fields={{
        RebateTableField: RebateTableField(rebateTableFormData, languageData, rebateTableHeaders),
        MinimumNetCommissionsField: MinimumNetCommissionsField(
          rebateSettings?.minimumNetCommissions,
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
      onSubmit={(data) => {
        if (!data.formData) return;
        setLoading(true);
        void postMerchantContractHeaderRebateSettingByHeaderIdApi({
          id: contractId,
          requestBody: data.formData,
        })
          .then((res) => {
            handlePostResponse(res, router);
          })
          .finally(() => {
            setLoading(false);
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
