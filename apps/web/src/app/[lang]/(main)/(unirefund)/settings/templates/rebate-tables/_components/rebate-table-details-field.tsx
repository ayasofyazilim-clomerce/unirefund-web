import type {UniRefund_ContractService_Rebates_RebateTableDetails_RebateTableDetailCreateDto as RebateTableDetailCreateDto} from "@ayasofyazilim/saas/ContractService";
import {$UniRefund_ContractService_Rebates_RebateTableDetails_RebateTableDetailCreateDto as $RebateTableDetailCreateDto} from "@ayasofyazilim/saas/ContractService";
import {tanstackTableEditableColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import {TableField} from "@repo/ayasofyazilim-ui/organisms/schema-form/fields";
import {PlusCircle} from "lucide-react";

export function RebateTableDetailsField(
  data: RebateTableDetailCreateDto[] = [
    {
      fixedFeeValue: 0,
      percentFeeValue: 0,
      refundMethod: "All",
      variableFee: "PercentOfGC",
    },
  ],
) {
  return TableField<RebateTableDetailCreateDto>({
    fillerColumn: "refundMethod",
    editable: true,
    data,
    columns: tanstackTableEditableColumnsByRowData<RebateTableDetailCreateDto>({
      rows: {
        ...$RebateTableDetailCreateDto.properties,
        variableFee: {
          ...$RebateTableDetailCreateDto.properties.variableFee,
          enum: $RebateTableDetailCreateDto.properties.variableFee.enum.map((item) => {
            return {
              value: item,
              label: item,
            };
          }),
        },
        refundMethod: {
          ...$RebateTableDetailCreateDto.properties.refundMethod,
          enum: $RebateTableDetailCreateDto.properties.refundMethod.enum.map((item) => {
            return {
              value: item,
              label: item,
            };
          }),
        },
      },
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
