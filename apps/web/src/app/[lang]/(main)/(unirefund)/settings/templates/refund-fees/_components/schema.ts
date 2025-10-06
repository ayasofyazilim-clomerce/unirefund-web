import {replacePlaceholders} from "@repo/ayasofyazilim-ui/lib/replace-placeholders";
import {z} from "zod";
import type {ContractServiceResource} from "@/language-data/unirefund/ContractService";

const FeeType = z.enum(["TouristFee", "TouristBonusFee", "AgentFee", "AirportFee", "EarlyRefundFee"]);
const RefundMethod = z.enum(["Cash", "CreditCard", "BankTransfer", "Wallet", "CashViaPartner"]);

export function createRefundFeeTableSchemas({languageData}: {languageData?: ContractServiceResource}) {
  const validateRefundFeeDetails = (details: RefundFeeDetail[]): ValidationResult => {
    if (details.length === 0) {
      return {isValid: true, errors: []};
    }

    const errors: ValidationResult["errors"] = [];

    // Group by feeType and refundMethod combination
    const groups = new Map<string, {detail: RefundFeeDetail; originalIndex: number}[]>();

    details.forEach((detail, index) => {
      const key = `${detail.feeType}-${detail.refundMethod}`;
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)?.push({detail, originalIndex: index});
    });

    // Validate each group
    for (const [groupKey, groupItems] of groups) {
      // Sort by amountFrom but keep original indices
      const sortedItems = groupItems.sort((a, b) => a.detail.amountFrom - b.detail.amountFrom);

      // First range must start from 0
      if (sortedItems[0].detail.amountFrom !== 0) {
        errors.push({
          index: sortedItems[0].originalIndex,
          field: "amountFrom",
          message: languageData
            ? replacePlaceholders(
                languageData["RefundFeeTable.Form.refundFeeDetails.firstRangeIn{0}groupMustStartFrom0"],
                [
                  {
                    holder: "{0}",
                    replacement: groupKey,
                  },
                ],
              ).join("")
            : `First range in ${groupKey} group must start from 0`,
          groupKey,
        });
      }

      // Check for continuous ranges (no gaps, no overlaps)
      for (let i = 1; i < sortedItems.length; i++) {
        const prev = sortedItems[i - 1];
        const current = sortedItems[i];

        // Current amountFrom should equal previous amountTo
        if (current.detail.amountFrom !== prev.detail.amountTo) {
          if (current.detail.amountFrom > prev.detail.amountTo) {
            errors.push({
              index: current.originalIndex,
              field: "amountFrom",
              message: languageData
                ? replacePlaceholders(languageData["RefundFeeTable.Form.refundFeeDetails.shouldBeEqualsTo{0}"], [
                    {
                      holder: "{0}",
                      replacement: prev.detail.amountTo,
                    },
                  ]).join("")
                : `Should be equals to ${prev.detail.amountTo}`,
              groupKey,
            });
          } else {
            errors.push({
              index: current.originalIndex,
              field: "amountFrom",
              message: languageData
                ? replacePlaceholders(languageData["RefundFeeTable.Form.refundFeeDetails.shouldBeEqualsTo{0}"], [
                    {
                      holder: "{0}",
                      replacement: prev.detail.amountTo,
                    },
                  ]).join("")
                : `Should be equals to ${prev.detail.amountTo}`,
              groupKey,
            });
          }
        } else if (current.detail.amountFrom === current.detail.amountTo) {
          errors.push({
            index: current.originalIndex,
            field: "amountTo",
            message: languageData
              ? replacePlaceholders(languageData["RefundFeeTable.Form.refundFeeDetails.shouldBeGreaterThan{0}"], [
                  {
                    holder: "{0}",
                    replacement: prev.detail.amountTo,
                  },
                ]).join("")
              : `Should be greater than ${current.detail.amountTo}`,
            groupKey,
          });
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };
  const refundFeeDetailSchema = z
    .object({
      amountFrom: z.number().min(0),
      amountTo: z.number(),
      fixedFeeValue: z.number().min(0),
      percentFeeValue: z.number().min(0).max(100),
      minFee: z.number().min(0),
      maxFee: z.number(),
      feeType: FeeType,
      refundMethod: RefundMethod,
    })
    .superRefine((details, ctx) => {
      if (details.minFee >= details.maxFee) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            languageData?.["RefundFeeTable.Form.refundFeeDetails.maxFeeMustBeGreaterThanMinFee"] ||
            "Maxfee min feeden küçük olamaz",
          path: ["maxFee"],
        });
      }
    });
  const createFormSchema = z
    .object({
      name: z
        .string()
        .min(2, {message: languageData ? languageData["Contracts.nameIsRequired"] : ""})
        .max(50),
      isActive: z.boolean().optional(),
      isTemplate: z.boolean().optional(),
      refundPointId: z.string().uuid().nullable().optional(),
      refundFeeDetails: z
        .array(refundFeeDetailSchema)
        .nullable()
        .optional()
        .refine(
          (details) => {
            if (!details || details.length === 0) return true;
            return validateRefundFeeDetails(
              details.map((item, originalIndex) => {
                return {...item, originalIndex};
              }),
            ).isValid;
          },
          {
            message: "Invalid refund fee details structure",
            path: ["refundFeeDetails"],
          },
        ),
    })
    .superRefine((data, ctx) => {
      if (!data.isTemplate) {
        if (!data.refundPointId) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: languageData
              ? languageData["RefundFeeTable.Form.refundPointSelectionIsRequiredWhenIsTemplateOptionFalse"]
              : "Refund point is required when template option is false.",
            path: ["refundPointId"],
          });
        }
      }
    });
  const updateFormSchema = z.object({
    name: z
      .string()
      .min(2, {message: languageData ? languageData["Contracts.nameIsRequired"] : ""})
      .max(50),
    isActive: z.boolean().default(false).optional(),
    refundFeeDetails: z
      .array(refundFeeDetailSchema)
      .nullable()
      .optional()
      .refine(
        (details) => {
          if (!details || details.length === 0) return true;
          return validateRefundFeeDetails(
            details.map((item, originalIndex) => {
              return {...item, originalIndex};
            }),
          ).isValid;
        },
        {
          message: "Invalid refund fee details structure",
          path: ["refundFeeDetails"],
        },
      ),
  });

  return {createFormSchema, updateFormSchema, validateRefundFeeDetails};
}

export interface RefundFeeDetail {
  amountFrom: number;
  amountTo: number;
  feeType: string;
  refundMethod: string;
  fixedFeeValue: number;
  percentFeeValue: number;
  minFee: number;
  maxFee: number;
  originalIndex: number;
}
export interface ValidationError {
  type: "missing_start" | "gap" | "overlap" | "invalid_range";
  message: string;
  affectedRanges: number[];
  groupKey: string;
}
export interface ValidationResult {
  isValid: boolean;
  errors: {
    index: number;
    field: "amountFrom" | "amountTo" | "general";
    message: string;
    groupKey: string;
  }[];
}
