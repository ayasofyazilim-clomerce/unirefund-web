import type {
  UniRefund_ContractService_Refunds_RefundTableHeaders_RefundTableHeaderInformationDto as AssignableRefundTableHeaders,
  UniRefund_ContractService_ContractsForMerchant_ContractHeaderRefundTableHeaders_ContractHeaderRefundTableHeaderCreateAndUpdateDto as ContractHeaderRefundTableHeaderCreateAndUpdateDto,
} from "@ayasofyazilim/saas/ContractService";
import {$UniRefund_ContractService_ContractsForMerchant_ContractHeaderRefundTableHeaders_ContractHeaderRefundTableHeaderCreateAndUpdateDto as $ContractHeaderRefundTableHeaderCreateAndUpdateDto} from "@ayasofyazilim/saas/ContractService";
import {tanstackTableEditableColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import {TableField} from "@repo/ayasofyazilim-ui/organisms/schema-form/fields";
import {PlusCircle} from "lucide-react";
import type {ContractServiceResource} from "@/language-data/unirefund/ContractService";

export function RefundTableHeadersField({
  data = [
    {
      validFrom: new Date().toISOString(),
      refundTableHeaderId: "",
      isDefault: false,
    },
  ],
  refundTableHeaders,
  languageData,
}: {
  refundTableHeaders: AssignableRefundTableHeaders[];
  data?: ContractHeaderRefundTableHeaderCreateAndUpdateDto[];
  languageData: ContractServiceResource;
}) {
  return TableField<ContractHeaderRefundTableHeaderCreateAndUpdateDto>({
    fillerColumn: "refundTableHeaderId",
    editable: true,
    data,
    columns: tanstackTableEditableColumnsByRowData<ContractHeaderRefundTableHeaderCreateAndUpdateDto>({
      rows: {
        ...$ContractHeaderRefundTableHeaderCreateAndUpdateDto.properties,
        refundTableHeaderId: {
          ...$ContractHeaderRefundTableHeaderCreateAndUpdateDto.properties.refundTableHeaderId,
          enum: refundTableHeaders.map((x) => ({
            label: x.name,
            value: x.id,
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
