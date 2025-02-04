import type {
  UniRefund_ContractService_Refunds_RefundFeeHeaders_RefundFeeHeaderInformationDto as AssignableRefundFeeHeaders,
  UniRefund_ContractService_ContractsForRefundPoint_ContractHeaderRefundFeeHeaders_ContractHeaderRefundFeeHeaderCreateAndUpdateDto as ContractHeaderRefundFeeHeaderCreateAndUpdateDto,
} from "@ayasofyazilim/saas/ContractService";
import { $UniRefund_ContractService_ContractsForRefundPoint_ContractHeaderRefundFeeHeaders_ContractHeaderRefundFeeHeaderCreateAndUpdateDto as $ContractHeaderRefundFeeHeaderCreateAndUpdateDto } from "@ayasofyazilim/saas/ContractService";
import { tanstackTableEditableColumnsByRowData } from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import { TableField } from "@repo/ayasofyazilim-ui/organisms/schema-form/fields";
import { PlusCircle } from "lucide-react";

export function RefundFeeHeadersField(
  refundFeeHeaders: AssignableRefundFeeHeaders[],
  data: ContractHeaderRefundFeeHeaderCreateAndUpdateDto[] = [
    {
      validFrom: new Date().toISOString(),
      refundFeeHeaderId: "",
      isDefault: false,
    },
  ],
) {
  return TableField<ContractHeaderRefundFeeHeaderCreateAndUpdateDto>({
    fillerColumn: "refundFeeHeaderId",
    editable: true,
    data,
    columns:
      tanstackTableEditableColumnsByRowData<ContractHeaderRefundFeeHeaderCreateAndUpdateDto>(
        {
          rows: {
            ...$ContractHeaderRefundFeeHeaderCreateAndUpdateDto.properties,
            refundFeeHeaderId: {
              ...$ContractHeaderRefundFeeHeaderCreateAndUpdateDto.properties
                .refundFeeHeaderId,
              enum: refundFeeHeaders.map((x) => ({
                label: x.name,
                value: x.id,
              })),
            },
          },
          excludeColumns: ["extraProperties"],
        },
      ),
    tableActions: [
      {
        type: "create-row",
        actionLocation: "table",
        cta: "Add", //languageData["Rebate.Form.rebateTableDetails.add"],
        icon: PlusCircle,
      },
    ],
    rowActions: [
      {
        actionLocation: "row",
        cta: "Delete", // languageData.Delete,
        type: "delete-row",
      },
    ],
  });
}
