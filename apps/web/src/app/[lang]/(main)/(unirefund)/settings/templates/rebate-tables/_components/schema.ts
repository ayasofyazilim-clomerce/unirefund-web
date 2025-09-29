import {z} from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import type {ContractServiceResource} from "@/language-data/unirefund/ContractService";

export function createRebateTableFormSchemas({languageData}: {languageData: ContractServiceResource}) {
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
          message: languageData["RebateTable.Form.rebateTableDetails.refundMethodAllCannotBeCombined"],
          path: [],
        });
      }
      if (allRows.length > 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            languageData["RebateTable.Form.rebateTableDetails.refundMethodOnlyOneRowAllowedWhenRefundPointIsAll"],
          path: [],
        });
      }
    });

  const createFormSchema = z
    .object({
      name: z.string().min(2).max(50),
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
            message:
              languageData["RebateTable.Form.rebateTableDetails.merchantSelectionIsRequiredWhenIsTemplateOptionFalse"],
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
