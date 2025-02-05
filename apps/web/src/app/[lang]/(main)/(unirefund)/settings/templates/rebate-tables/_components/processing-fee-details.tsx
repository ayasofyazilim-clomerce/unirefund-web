import type {UniRefund_ContractService_Rebates_ProcessingFeeDetails_ProcessingFeeDetailCreateDto as ProcessingFeeDetailCreateDto} from "@ayasofyazilim/saas/ContractService";
import {$UniRefund_ContractService_Rebates_ProcessingFeeDetails_ProcessingFeeDetailCreateDto as $ProcessingFeeDetailCreateDto} from "@ayasofyazilim/saas/ContractService";
import {tanstackTableEditableColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import {TableField} from "@repo/ayasofyazilim-ui/organisms/schema-form/fields";
import {PlusCircle} from "lucide-react";

export function ProcessingFeeDetailsField(
  data: ProcessingFeeDetailCreateDto[] = [
    {
      amount: 0,
      name: "",
    },
  ],
) {
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
