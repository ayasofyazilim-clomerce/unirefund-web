import type {UniRefund_ContractService_Refunds_RefundFeeDetails_RefundFeeDetailCreateDto as RefundFeeDetailCreateDto} from "@ayasofyazilim/saas/ContractService";
import {$UniRefund_ContractService_Refunds_RefundFeeDetails_RefundFeeDetailCreateDto as $RefundFeeDetailCreateDto} from "@ayasofyazilim/saas/ContractService";
import {tanstackTableEditableColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import {TableField} from "@repo/ayasofyazilim-ui/organisms/schema-form/fields";
import {PlusCircle} from "lucide-react";
import type {ContractServiceResource} from "@/language-data/unirefund/ContractService";

export function RefundFeeDetailsField({
  languageData,
  data = [
    {
      amountFrom: 0,
      amountTo: 0,
      feeType: "AgentFee",
      refundMethod: "All",
      fixedFeeValue: 0,
      maxFee: 0,
      minFee: 0,
      percentFeeValue: 0,
    },
  ],
}: {
  data?: RefundFeeDetailCreateDto[];
  languageData: ContractServiceResource;
}) {
  return TableField<RefundFeeDetailCreateDto>({
    fillerColumn: "amountFrom",
    editable: true,
    data,
    columns: tanstackTableEditableColumnsByRowData<RefundFeeDetailCreateDto>({
      rows: {
        ...$RefundFeeDetailCreateDto.properties,
        feeType: {
          ...$RefundFeeDetailCreateDto.properties.feeType,
          enum: $RefundFeeDetailCreateDto.properties.feeType.enum.map((item) => {
            return {
              value: item,
              label: item,
            };
          }),
        },
        refundMethod: {
          ...$RefundFeeDetailCreateDto.properties.refundMethod,
          enum: $RefundFeeDetailCreateDto.properties.refundMethod.enum.map((item) => {
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
