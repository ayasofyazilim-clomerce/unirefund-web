import type {UniRefund_ContractService_Rebates_ProcessingFeeDetails_ProcessingFeeDetailCreateDto as ProcessingFeeDetailCreateDto} from "@ayasofyazilim/saas/ContractService";
import {$UniRefund_ContractService_Rebates_ProcessingFeeDetails_ProcessingFeeDetailCreateDto as $ProcessingFeeDetailCreateDto} from "@ayasofyazilim/saas/ContractService";
import {tanstackTableEditableColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import {TableField} from "@repo/ayasofyazilim-ui/organisms/schema-form/fields";
import {PlusCircle} from "lucide-react";
import type {ContractServiceResource} from "@/language-data/unirefund/ContractService";

export function ProcessingFeeDetailsField({
  data = [
    {
      amount: 0,
      name: "",
    },
  ],
  languageData,
}: {
  data?: ProcessingFeeDetailCreateDto[];
  languageData: ContractServiceResource;
}) {
  return TableField<ProcessingFeeDetailCreateDto>({
    fillerColumn: "name",
    editable: true,
    data,
    columns: tanstackTableEditableColumnsByRowData<ProcessingFeeDetailCreateDto>({
      rows: $ProcessingFeeDetailCreateDto.properties,
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
