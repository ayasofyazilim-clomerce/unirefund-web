import type {UniRefund_ContractService_Refunds_RefundTableDetails_RefundTableDetailCreateDto as RefundTableDetailCreateDto} from "@ayasofyazilim/saas/ContractService";
import {$UniRefund_ContractService_Refunds_RefundTableDetails_RefundTableDetailCreateDto as $RefundTableDetailCreateDto} from "@ayasofyazilim/saas/ContractService";
import {tanstackTableEditableColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import {TableField} from "@repo/ayasofyazilim-ui/organisms/schema-form/fields";
import {PlusCircle} from "lucide-react";
import type {ContractServiceResource} from "@/language-data/unirefund/ContractService";

export function RefundTableDetailsField({
  data = [
    {
      maxValue: 0,
      minValue: 0,
      refundAmount: 0,
      refundPercent: 0,
      vatRate: 0,
    },
  ],
  languageData,
}: {
  data?: RefundTableDetailCreateDto[];
  languageData: ContractServiceResource;
}) {
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
        cta: languageData["Table.Add"],
        icon: PlusCircle,
      },
    ],
    rowActions: [
      {
        actionLocation: "row",
        cta: languageData["Table.MoveUp"],
        type: "move-row-up",
      },
      {
        actionLocation: "row",
        cta: languageData["Table.Delete"],
        type: "delete-row",
      },
      {
        actionLocation: "row",
        cta: languageData["Table.Duplicate"],
        type: "duplicate-row",
      },
      {
        actionLocation: "row",
        cta: languageData["Table.MoveDown"],
        type: "move-row-down",
      },
    ],
  });
}
