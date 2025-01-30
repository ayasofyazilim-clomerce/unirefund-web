import type { UniRefund_ContractService_Refunds_RefundFeeDetails_RefundFeeDetailCreateDto as RefundFeeDetailCreateDto } from "@ayasofyazilim/saas/ContractService";
import { $UniRefund_ContractService_Refunds_RefundFeeDetails_RefundFeeDetailCreateDto as $RefundFeeDetailCreateDto } from "@ayasofyazilim/saas/ContractService";
import { tanstackTableEditableColumnsByRowData } from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import { TableField } from "@repo/ayasofyazilim-ui/organisms/schema-form/fields";
import { PlusCircle } from "lucide-react";

export function RefundFeeDetailsField(
  data: RefundFeeDetailCreateDto[] = [
    {
      amountFrom: 0,
      amountTo: 0,
      feeType: "AgentFee",
      refundMethod: "All",
      fixedFeeValue: 0,
      maxFee: 0,
      minFee: 0,
      percentFeeValue: 0,
      percentFeeValueEarlyRefund: 0,
      fixedFeeValueEarlyRefund: 0,
      maxFeeEarlyRefund: 0,
      minFeeEarlyRefund: 0,
    },
  ],
) {
  return TableField<RefundFeeDetailCreateDto>({
    fillerColumn: "amountFrom",
    editable: true,
    data,
    columns: tanstackTableEditableColumnsByRowData<RefundFeeDetailCreateDto>({
      rows: {
        ...$RefundFeeDetailCreateDto.properties,
        feeType: {
          ...$RefundFeeDetailCreateDto.properties.feeType,
          enum: $RefundFeeDetailCreateDto.properties.feeType.enum.map(
            (item) => {
              return {
                value: item,
                label: item,
              };
            },
          ),
        },
        refundMethod: {
          ...$RefundFeeDetailCreateDto.properties.refundMethod,
          enum: $RefundFeeDetailCreateDto.properties.refundMethod.enum.map(
            (item) => {
              return {
                value: item,
                label: item,
              };
            },
          ),
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
