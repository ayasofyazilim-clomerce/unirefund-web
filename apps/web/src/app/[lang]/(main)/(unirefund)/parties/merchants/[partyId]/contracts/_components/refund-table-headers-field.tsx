import type {
  UniRefund_ContractService_Refunds_RefundTableHeaders_RefundTableHeaderInformationDto as AssignableRefundTableHeaders,
  UniRefund_ContractService_ContractsForMerchant_ContractHeaderRefundTableHeaders_ContractHeaderRefundTableHeaderCreateAndUpdateDto as ContractHeaderRefundTableHeaderCreateAndUpdateDto,
} from "@ayasofyazilim/saas/ContractService";
import { $UniRefund_ContractService_ContractsForMerchant_ContractHeaderRefundTableHeaders_ContractHeaderRefundTableHeaderCreateAndUpdateDto as $ContractHeaderRefundTableHeaderCreateAndUpdateDto } from "@ayasofyazilim/saas/ContractService";
import { tanstackTableEditableColumnsByRowData } from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import { TableField } from "@repo/ayasofyazilim-ui/organisms/schema-form/fields";
import { PlusCircle } from "lucide-react";

export function RefundTableHeadersField(
  refundTableHeaders: AssignableRefundTableHeaders[],
  data: ContractHeaderRefundTableHeaderCreateAndUpdateDto[] = [
    {
      validFrom: new Date().toISOString(),
      refundTableHeaderId: "",
      isDefault: false,
    },
  ],
) {
  return TableField<ContractHeaderRefundTableHeaderCreateAndUpdateDto>({
    fillerColumn: "refundTableHeaderId",
    editable: true,
    data,
    columns:
      tanstackTableEditableColumnsByRowData<ContractHeaderRefundTableHeaderCreateAndUpdateDto>(
        {
          rows: {
            ...$ContractHeaderRefundTableHeaderCreateAndUpdateDto.properties,
            refundTableHeaderId: {
              ...$ContractHeaderRefundTableHeaderCreateAndUpdateDto.properties
                .refundTableHeaderId,
              enum: refundTableHeaders.map((x) => ({
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
