import {z} from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import type {ContractServiceResource} from "@/language-data/unirefund/ContractService";

export function createRefundTableFormSchemas({languageData}: {languageData?: ContractServiceResource}) {
  const refundTableDetailSchema = z.object({
    vatRate: z.number(),
    minValue: z.number(),
    maxValue: z.number(),
    refundAmount: z.number(),
    refundPercent: z.number(),
    isLoyalty: z.boolean().default(false),
  });

  const createFormSchema = z
    .object({
      name: z
        .string()
        .min(2, {message: languageData ? languageData["Contracts.nameIsRequired"] : ""})
        .max(50),
      isDefault: z.boolean().default(false).optional(),
      isBundling: z.boolean().default(false).optional(),
      isTemplate: z.boolean().default(false).optional(),
      merchantId: z.string().uuid().nullable().optional(),
      refundTableDetails: z.array(refundTableDetailSchema).nullable().optional(),
    })
    .superRefine((data, ctx) => {
      if (!data.isTemplate) {
        if (!data.merchantId) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: languageData
              ? languageData["RefundTable.Form.merchantSelectionIsRequiredWhenIsTemplateOptionFalse"]
              : "Merchant is required when template option is false.",
            path: ["merchantId"],
          });
        }
      }
    });
  const updateFormSchema = z.object({
    name: z
      .string()
      .min(2, {message: languageData ? languageData["Contracts.nameIsRequired"] : ""})
      .max(50),
    isDefault: z.boolean().default(false).optional(),
    isBundling: z.boolean().default(false).optional(),
    refundTableDetails: z.array(refundTableDetailSchema).nullable().optional(),
  });
  return {createFormSchema, updateFormSchema, refundTableDetailSchema};
}
