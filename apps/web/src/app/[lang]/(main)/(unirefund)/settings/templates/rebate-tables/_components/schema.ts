import {z} from "zod";
import type {ContractServiceResource} from "@/language-data/unirefund/ContractService";

export function createRebateTableFormSchemas({languageData}: {languageData?: ContractServiceResource}) {
  const processingFeeDetailsSchema = z
    .array(
      z.object({
        name: z.string(),
        amount: z.coerce.number(),
      }),
    )
    .nullable();

  const rebateTableDetailsSchema = z
    .array(
      z.object({
        fixedFeeValue: z.coerce.number(),
        percentFeeValue: z.coerce.number(),
        refundMethod: z.enum(["Cash", "CreditCard", "BankTransfer", "Wallet", "CashViaPartner", "All"]),
        variableFee: z.enum(["PercentOfGC", "PercentOfGcWithoutVAT", "PercentOfVAT", "PercentOfSIS"]),
      }),
    )
    .nullable()
    .superRefine((rows, ctx) => {
      if (!rows) return;
      const allRows = rows.filter((r) => r.refundMethod === "All");
      if (allRows.length === 1 && rows.length > 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: languageData
            ? languageData["RebateTable.Form.rebateTableDetails.refundMethodAllCannotBeCombined"]
            : "'All' refundMethod cannot be combined with other refundMethods.",
          path: [],
        });
      }
      if (allRows.length > 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: languageData
            ? languageData["RebateTable.Form.rebateTableDetails.refundMethodOnlyOneRowAllowedWhenRefundPointIsAll"]
            : "Only one row allowed when refundMethod is 'All'.",
          path: [],
        });
      }
    });

  const createFormSchema = z
    .object({
      name: z
        .string()
        .min(2, {message: languageData ? languageData["Contracts.nameIsRequired"] : ""})
        .max(50),
      isTemplate: z.boolean().default(false).optional(),
      calculateNetCommissionInsteadOfRefund: z.boolean().default(false).optional(),
      merchantId: z.string().uuid().optional().nullable(),
      processingFeeDetails: processingFeeDetailsSchema,
      rebateTableDetails: rebateTableDetailsSchema,
    })
    .superRefine((data, ctx) => {
      if (!data.isTemplate) {
        if (!data.merchantId) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: languageData
              ? languageData["RebateTable.Form.merchantSelectionIsRequiredWhenIsTemplateOptionFalse"]
              : "Merchant is required when template option is false.",
            path: ["merchantId"],
          });
        }
      }
    });
  const updateFormSchema = z.object({
    name: z.string().min(2).max(50),
    calculateNetCommissionInsteadOfRefund: z.boolean().default(false).optional(),
    processingFeeDetails: processingFeeDetailsSchema,
    rebateTableDetails: rebateTableDetailsSchema,
  });
  return {createFormSchema, updateFormSchema};
}
