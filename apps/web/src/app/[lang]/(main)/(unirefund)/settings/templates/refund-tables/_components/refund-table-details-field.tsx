import type { UniRefund_ContractService_Refunds_RefundTableDetails_RefundTableDetailCreateDto as RefundTableDetailCreateDto } from "@ayasofyazilim/saas/ContractService";
import { $UniRefund_ContractService_Refunds_RefundTableDetails_RefundTableDetailCreateDto as $RefundTableDetailCreateDto } from "@ayasofyazilim/saas/ContractService";
import { tanstackTableEditableColumnsByRowData } from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import { TableField } from "@repo/ayasofyazilim-ui/organisms/schema-form/fields";
import { PlusCircle } from "lucide-react";

export function RefundTableDetailsField(
  data: RefundTableDetailCreateDto[] = [
    {
      maxValue: 0,
      minValue: 0,
      refundAmount: 0,
      refundPercent: 0,
      vatRate: 0,
    },
  ],
) {
  return TableField<RefundTableDetailCreateDto>({
    editable: true,
    data,
    columns: tanstackTableEditableColumnsByRowData<RefundTableDetailCreateDto>({
      rows: $RefundTableDetailCreateDto.properties,
      excludeColumns: ["extraProperties"],
    }),
    tableActions: [
      {
        type: "create-row",
        actionLocation: "table",
        cta: "Add",
        icon: PlusCircle,
      },
    ],
    rowActions: [
      {
        actionLocation: "row",
        cta: "Delete",
        type: "delete-row",
      },
    ],
  });
}
