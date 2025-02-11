import type {UniRefund_ContractService_Rebates_RebateTableDetails_RebateTableDetailCreateDto as RebateTableDetailCreateDto} from "@ayasofyazilim/saas/ContractService";
import {$UniRefund_ContractService_Rebates_RebateTableDetails_RebateTableDetailCreateDto as $RebateTableDetailCreateDto} from "@ayasofyazilim/saas/ContractService";
import {tanstackTableEditableColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import {TableField} from "@repo/ayasofyazilim-ui/organisms/schema-form/fields";
import {PlusCircle} from "lucide-react";
import type {ContractServiceResource} from "@/language-data/unirefund/ContractService";

export function RebateTableDetailsField({
  data = [
    {
      fixedFeeValue: 0,
      percentFeeValue: 0,
      refundMethod: "All",
      variableFee: "PercentOfGC",
    },
  ],
  languageData,
}: {
  data?: RebateTableDetailCreateDto[];
  languageData: ContractServiceResource;
}) {
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
