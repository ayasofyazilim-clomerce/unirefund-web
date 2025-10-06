import {z} from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import {replacePlaceholders} from "@repo/ayasofyazilim-ui/lib/replace-placeholders";
import type {ContractServiceResource} from "@/language-data/unirefund/ContractService";

export function createRefundTableFormSchemas({languageData}: {languageData?: ContractServiceResource}) {
  // Shared validation function for refund table details
  const validateRefundTableDetails = (
    details: {
      vatRate: number;
      minValue: number;
      maxValue: number;
      refundAmount: number;
      refundPercent: number;
      isLoyalty: boolean;
    }[],
    ctx: z.RefinementCtx,
  ) => {
    // Individual row validations
    details.forEach((detail, index) => {
      const basePath = ["refundTableDetails", index];
      if (index === 0 && detail.minValue !== 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: languageData
            ? languageData["RefundTable.Form.refundTableDetails.firstRowMustStartFromZero"]
            : "First row must start from 0",
          path: [...basePath, "minValue"],
        });
      }
      const sorted = [...details].sort((a, b) => a.minValue - b.minValue);
      const currentIndex = sorted.findIndex(
        (row) => row.minValue === detail.minValue && row.maxValue === detail.maxValue,
      );

      if (currentIndex > 0) {
        const previousRow = sorted[currentIndex - 1];
        if (detail.minValue !== previousRow.maxValue) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: replacePlaceholders(
              languageData
                ? languageData["RefundTable.Form.refundTableDetails.minValueMustBe{0}toContinueFromPreviousRow"]
                : "Min value must be {0} to continue from previous row.",
              [
                {
                  holder: "{0}",
                  replacement: previousRow.maxValue,
                },
              ],
            ).join(""),
            path: [...basePath, "minValue"],
          });
        }
      }

      // maxValue must be greater than minValue
      if (detail.maxValue <= detail.minValue) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: languageData
            ? languageData["RefundTable.Form.refundTableDetails.maxValueMustBeGreaterThanMinValue"]
            : "Max value must be greater than min value",
          path: [...basePath, "maxValue"],
        });
      }

      // maxValue must be greater than refundAmount
      if (detail.maxValue <= detail.refundAmount) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: languageData
            ? languageData["RefundTable.Form.refundTableDetails.maxValueMustBeGreaterThanRefundAmount"]
            : "Max value must be greater than refund amount",
          path: [...basePath, "maxValue"],
        });
      }

      // refundPercent must be lower than vatRate
      if (detail.refundPercent >= detail.vatRate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: languageData
            ? languageData["RefundTable.Form.refundTableDetails.refundPercentMustBeLowerThanVatRate"]
            : "Refund percent must be lower than VAT rate",
          path: [...basePath, "refundPercent"],
        });
      }
    });
  };

  const refundTableDetailSchema = z.object({
    vatRate: z.number().min(0, {
      message: languageData
        ? languageData["RefundTable.Form.refundTableDetails.vatRateMin0"]
        : "Number must be greater than or equal to 0",
    }),
    minValue: z.number().min(0, {
      message: languageData
        ? languageData["RefundTable.Form.refundTableDetails.minValueMin0"]
        : "Number must be greater than or equal to 0",
    }),
    maxValue: z.number(),
    refundAmount: z.number().min(0, {
      message: languageData
        ? languageData["RefundTable.Form.refundTableDetails.refundAmountMin0"]
        : "Number must be greater than or equal to 0",
    }),
    refundPercent: z
      .number()
      .min(0, {
        message: languageData
          ? languageData["RefundTable.Form.refundTableDetails.refundPercentMin0"]
          : "Number must be greater than or equal to 0",
      })
      .max(100, {
        message: languageData
          ? languageData["RefundTable.Form.refundTableDetails.refundPercentMax100"]
          : "Number must be less than or equal to 100",
      }),
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
      // Merchant validation
      if (!data.isTemplate && !data.merchantId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: languageData
            ? languageData["RefundTable.Form.merchantSelectionIsRequiredWhenIsTemplateOptionFalse"]
            : "Merchant is required when template option is false.",
          path: ["merchantId"],
        });
      }

      // Refund table details validation
      if (data.refundTableDetails) {
        validateRefundTableDetails(data.refundTableDetails, ctx);
      }
    });

  const updateFormSchema = z
    .object({
      name: z
        .string()
        .min(2, {message: languageData ? languageData["Contracts.nameIsRequired"] : ""})
        .max(50),
      isDefault: z.boolean().default(false).optional(),
      isBundling: z.boolean().default(false).optional(),
      refundTableDetails: z.array(refundTableDetailSchema).nullable().optional(),
    })
    .superRefine((data, ctx) => {
      // Refund table details validation (reusing the same function)
      if (data.refundTableDetails) {
        validateRefundTableDetails(data.refundTableDetails, ctx);
      }
    });

  return {createFormSchema, updateFormSchema, refundTableDetailSchema};
}
