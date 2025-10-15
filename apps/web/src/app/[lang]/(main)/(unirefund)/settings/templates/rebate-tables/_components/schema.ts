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
        fixedFeeValue: z.coerce.number().min(0),
        percentFeeValue: z.coerce.number().min(0).max(100),
        rebateMethod: z.enum(["Cash", "CreditCard", "BankTransfer", "Wallet", "CashViaPartner", "All", "IbanTransfer"]),
        variableFee: z.enum(["PercentOfGC", "PercentOfGcWithoutVAT", "PercentOfVAT", "PercentOfSIS"]),
      }),
    )
    .nullable()
    .superRefine((rows, ctx) => {
      if (!rows) return;
      const allRows = rows.filter((r) => r.rebateMethod === "All");
      if (allRows.length === 1 && rows.length > 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: languageData
            ? languageData["RebateTable.Form.rebateTableDetails.rebateMethodAllCannotBeCombined"]
            : "'All' rebateMethod cannot be combined with other rebateMethods.",
          path: [],
        });
      }
      if (allRows.length > 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: languageData
            ? languageData["RebateTable.Form.rebateTableDetails.rebateMethodOnlyOneRowAllowedWhenRefundPointIsAll"]
            : "Only one row allowed when rebateMethod is 'All'.",
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
      isTemplate: z.boolean().default(false),
      calculateNetCommissionInsteadOfRefund: z.boolean().default(false),
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
    calculateNetCommissionInsteadOfRefund: z.boolean().default(false),
    processingFeeDetails: processingFeeDetailsSchema,
    rebateTableDetails: rebateTableDetailsSchema,
  });
  return {createFormSchema, updateFormSchema};
}
