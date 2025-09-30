import {z} from "@repo/ayasofyazilim-ui/lib/create-zod-object";

export function createRefundTableFormSchemas() {
  const refundTableDetailSchema = z.object({
    extraProperties: z.record(z.unknown()).nullable().optional(),
    vatRate: z.number(),
    minValue: z.number(),
    maxValue: z.number(),
    refundAmount: z.number(),
    refundPercent: z.number(),
    isLoyalty: z.boolean().optional(),
  });

  const createFormSchema = z.object({
    extraProperties: z.record(z.unknown()).nullable().optional(),
    name: z.string().min(0).max(255),
    isDefault: z.boolean().optional(),
    isBundling: z.boolean().optional(),
    isTemplate: z.boolean().optional(),
    merchantId: z.string().uuid().nullable().optional(),
    refundTableDetails: z.array(refundTableDetailSchema).nullable().optional(),
  });
  const updateFormSchema = z.object({
    extraProperties: z.record(z.unknown()).nullable().optional(),
    name: z.string().min(0).max(255),
    isDefault: z.boolean().optional(),
    isBundling: z.boolean().optional(),
    refundTableDetails: z.array(refundTableDetailSchema).nullable().optional(),
  });
  return {createFormSchema, updateFormSchema, refundTableDetailSchema};
}
