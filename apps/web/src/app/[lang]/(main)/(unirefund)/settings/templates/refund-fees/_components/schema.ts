import {replacePlaceholders} from "@repo/ayasofyazilim-ui/lib/replace-placeholders";
import {z} from "zod";
import type {ContractServiceResource} from "@/language-data/unirefund/ContractService";

const FeeType = z.enum(["TouristFee", "TouristBonusFee", "AgentFee", "AirportFee", "EarlyRefundFee"]);
const RefundMethod = z.enum(["Cash", "CreditCard", "BankTransfer", "Wallet", "CashViaPartner", "All"]);

export function createRefundFeeTableSchemas({languageData}: {languageData?: ContractServiceResource}) {
  // Individual RefundFeeDetail validation (1.1 - 1.6)
  const refundFeeDetailSchema = z
    .object({
      amountFrom: z.number().min(0, {
        message: languageData
          ? languageData["RefundFeeTable.Form.refundFeeDetails.amountFrom.minError"]
          : "Amount from cannot be lower than zero!",
      }),
      amountTo: z.number(),
      fixedFeeValue: z.number().min(0, {
        message: languageData
          ? languageData["RefundFeeTable.Form.refundFeeDetails.fixedFeeValue.minError"]
          : "Fixed fee cannot be lower than zero!",
      }),
      percentFeeValue: z
        .number()
        .min(0, {
          message: languageData
            ? languageData["RefundFeeTable.Form.refundFeeDetails.percentFeeValue.minError"]
            : "Percent fee cannot be lower than zero!",
        })
        .max(100, {
          message: languageData
            ? languageData["RefundFeeTable.Form.refundFeeDetails.percentFeeValue.maxError"]
            : "Percent fee cannot be more than 100!",
        }),
      minFee: z.number().min(0, {
        message: languageData
          ? languageData["RefundFeeTable.Form.refundFeeDetails.minFee.minError"]
          : "Min fee cannot be lower than zero!",
      }),
      maxFee: z.number(),
      feeType: FeeType,
      refundMethod: RefundMethod,
    })
    .superRefine((data, ctx) => {
      // 1.5 AmountTo > AmountFrom (Strict order)
      if (data.amountTo <= data.amountFrom) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: replacePlaceholders(
            languageData
              ? languageData["RefundFeeTable.Form.refundFeeDetails.amountTo.lowerOrEqualThan{0}"]
              : "Amount to cannot be equal to or lower than {0}!",
            [
              {
                holder: "{0}",
                replacement: data.amountFrom,
              },
            ],
          ).join(""),
          path: ["amountTo"],
        });
      }

      // 1.6 MaxFee > MinFee (Strict order)
      if (data.maxFee <= data.minFee) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: replacePlaceholders(
            languageData
              ? languageData["RefundFeeTable.Form.refundFeeDetails.maxFee.lowerOrEqualThan{0}"]
              : "Max fee cannot be equal to or lower than {0}!",
            [
              {
                holder: "{0}",
                replacement: data.minFee,
              },
            ],
          ).join(""),
          path: ["maxFee"],
        });
      }
    });

  // Helper function to check if ranges overlap with special [0, y] rule
  const rangesOverlap = (
    a: {amountFrom: number; amountTo: number},
    b: {amountFrom: number; amountTo: number},
  ): boolean => {
    // Special case: if either range starts at 0, it includes the lower bound [0, y]
    // This means [0, 100] and (0, 100] would overlap at point 0
    if (a.amountFrom === 0 && b.amountFrom === 0) {
      return a.amountTo > b.amountFrom || b.amountTo > a.amountFrom;
    }

    // Standard (x, y] semantics: overlap if max(aFrom, bFrom) < min(aTo, bTo)
    return Math.max(a.amountFrom, b.amountFrom) < Math.min(a.amountTo, b.amountTo);
  };

  const refundFeeDetailsArraySchema = z
    .array(refundFeeDetailSchema)
    .nullable()
    .optional()
    .superRefine((details, ctx) => {
      if (!details || details.length === 0) return;

      // 2.1 Required FeeTypes
      const hasTouristFee = details.some((d) => d.feeType === "TouristFee");
      const hasAgentFee = details.some((d) => d.feeType === "AgentFee");

      if (!hasTouristFee) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: replacePlaceholders(
            languageData
              ? languageData["RefundFeeTable.Form.refundFeeDetails.requiredFeeTypeError"]
              : "At least one {0} must be defined.",
            [
              {
                holder: "{0}",
                replacement: languageData
                  ? languageData["RefundFeeTable.Form.refundFeeDetails.feeType.TouristFee"]
                  : "TouristFee",
              },
            ],
          ).join(""),
          path: [],
        });
      }

      if (!hasAgentFee) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: replacePlaceholders(
            languageData
              ? languageData["RefundFeeTable.Form.refundFeeDetails.requiredFeeTypeError"]
              : "At least one {0} must be defined.",
            [
              {
                holder: "{0}",
                replacement: languageData
                  ? languageData["RefundFeeTable.Form.refundFeeDetails.feeType.AgentFee"]
                  : "AgentFee",
              },
            ],
          ).join(""),
          path: [],
        });
      }

      // Group by FeeType
      const feeTypeGroups = new Map<string, typeof details>();
      details.forEach((detail) => {
        const feeType = detail.feeType;
        if (!feeTypeGroups.has(feeType)) {
          feeTypeGroups.set(feeType, []);
        }
        feeTypeGroups.get(feeType)?.push(detail);
      });

      // Validate each FeeType group
      for (const [feeType, feeTypeDetails] of feeTypeGroups) {
        // Group by RefundMethod within FeeType
        const methodGroups = new Map<string, {detail: (typeof details)[0]; index: number}[]>();

        feeTypeDetails.forEach((detail) => {
          const method = detail.refundMethod;
          if (!methodGroups.has(method)) {
            methodGroups.set(method, []);
          }
          const originalIndex = details.indexOf(detail);
          methodGroups.get(method)?.push({detail, index: originalIndex});
        });

        // 2.3 RefundMethod "All" exclusivity check
        const allMethodGroup = methodGroups.get("All");
        if (allMethodGroup && allMethodGroup.length > 0) {
          // Check if "All" overlaps with any other method in the same FeeType
          for (const [method, methodItems] of methodGroups) {
            if (method === "All") continue;

            for (const allItem of allMethodGroup) {
              for (const otherItem of methodItems) {
                if (rangesOverlap(allItem.detail, otherItem.detail)) {
                  ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: languageData
                      ? replacePlaceholders(
                          languageData["RefundFeeTable.Form.refundFeeDetails.allMethodMustBeExclusive"],
                          [
                            {holder: "{0}", replacement: feeType},
                            {holder: "{1}", replacement: allItem.detail.amountFrom.toString()},
                            {holder: "{2}", replacement: allItem.detail.amountTo.toString()},
                            {holder: "{3}", replacement: otherItem.detail.amountFrom.toString()},
                            {holder: "{4}", replacement: otherItem.detail.amountTo.toString()},
                            {holder: "{5}", replacement: method},
                          ],
                        ).join("")
                      : `RefundMethod 'All' must be exclusive for FeeType '${feeType}' within overlapping ranges: [${allItem.detail.amountFrom},${allItem.detail.amountTo}] (All) and [${otherItem.detail.amountFrom},${otherItem.detail.amountTo}] (${method}).`,
                    path: [allItem.index],
                  });
                }
              }
            }
          }
        }

        // 2.2, 2.4, 2.5 - Validate each RefundMethod group
        for (const [method, methodItems] of methodGroups) {
          // Sort by amountFrom
          const sortedItems = [...methodItems].sort((a, b) => a.detail.amountFrom - b.detail.amountFrom);

          // 2.4 Must start from 0
          if (sortedItems[0].detail.amountFrom !== 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: languageData
                ? replacePlaceholders(
                    languageData["RefundFeeTable.Form.refundFeeDetails.mustStartFromZero"] ||
                      "Fee type '{0}', refund method '{1}' must include a range starting from 0.",
                    [
                      {holder: "{0}", replacement: feeType},
                      {holder: "{1}", replacement: method},
                    ],
                  ).join("")
                : `Fee type '${feeType}', refund method '${method}' must include a range starting from 0.`,
              path: [sortedItems[0].index],
            });
          }

          // 2.2 & 2.5 Check for continuity, gaps, overlaps, and duplicates
          for (let i = 0; i < sortedItems.length; i++) {
            const current = sortedItems[i];

            // Check for duplicates and overlaps with other items in the same group
            for (let j = i + 1; j < sortedItems.length; j++) {
              const other = sortedItems[j];

              // 2.5 Duplicate or overlapping ranges
              if (rangesOverlap(current.detail, other.detail)) {
                const isDuplicate =
                  current.detail.amountFrom === other.detail.amountFrom &&
                  current.detail.amountTo === other.detail.amountTo;

                let message: string;

                if (languageData) {
                  const messageKey = isDuplicate
                    ? "RefundFeeTable.Form.refundFeeDetails.duplicateRange"
                    : "RefundFeeTable.Form.refundFeeDetails.overlappingRanges";

                  const defaultMessage = isDuplicate
                    ? "Duplicate RefundMethod '{0}' for FeeType '{1}' across overlapping ranges: [{2},{3}] and [{4},{5}]."
                    : "Overlapping ranges for FeeType '{0}', RefundMethod '{1}': [{2},{3}] and [{4},{5}].";

                  const placeholders = isDuplicate
                    ? [
                        {holder: "{0}", replacement: method},
                        {holder: "{1}", replacement: feeType},
                        {holder: "{2}", replacement: current.detail.amountFrom.toString()},
                        {holder: "{3}", replacement: current.detail.amountTo.toString()},
                        {holder: "{4}", replacement: other.detail.amountFrom.toString()},
                        {holder: "{5}", replacement: other.detail.amountTo.toString()},
                      ]
                    : [
                        {holder: "{0}", replacement: feeType},
                        {holder: "{1}", replacement: method},
                        {holder: "{2}", replacement: current.detail.amountFrom.toString()},
                        {holder: "{3}", replacement: current.detail.amountTo.toString()},
                        {holder: "{4}", replacement: other.detail.amountFrom.toString()},
                        {holder: "{5}", replacement: other.detail.amountTo.toString()},
                      ];

                  message = replacePlaceholders(languageData[messageKey] || defaultMessage, placeholders).join("");
                } else {
                  message = isDuplicate
                    ? `Duplicate RefundMethod '${method}' for FeeType '${feeType}' across overlapping ranges: [${current.detail.amountFrom},${current.detail.amountTo}] and [${other.detail.amountFrom},${other.detail.amountTo}].`
                    : `Overlapping ranges for FeeType '${feeType}', RefundMethod '${method}': [${current.detail.amountFrom},${current.detail.amountTo}] and [${other.detail.amountFrom},${other.detail.amountTo}].`;
                }

                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message,
                  path: [other.index],
                });
              }
            }

            // 2.2 Check continuity with next item
            if (i < sortedItems.length - 1) {
              const next = sortedItems[i + 1];

              if (next.detail.amountFrom !== current.detail.amountTo) {
                const isGap = next.detail.amountFrom > current.detail.amountTo;

                let message: string;

                if (languageData) {
                  const messageKey = isGap
                    ? "RefundFeeTable.Form.refundFeeDetails.gapDetected"
                    : "RefundFeeTable.Form.refundFeeDetails.shouldBeEqualsTo{0}";

                  const defaultMessage = isGap
                    ? "Gap detected for FeeType '{0}', RefundMethod '{1}': [{2},{3}] → [{4},{5}]. Ranges must be continuous (next.AmountFrom must equal prev.AmountTo)."
                    : "Should be equals to {0}";

                  const placeholders = isGap
                    ? [
                        {holder: "{0}", replacement: feeType},
                        {holder: "{1}", replacement: method},
                        {holder: "{2}", replacement: current.detail.amountFrom.toString()},
                        {holder: "{3}", replacement: current.detail.amountTo.toString()},
                        {holder: "{4}", replacement: next.detail.amountFrom.toString()},
                        {holder: "{5}", replacement: next.detail.amountTo.toString()},
                      ]
                    : [
                        {holder: "{0}", replacement: current.detail.amountTo.toString()},
                        {holder: "{1}", replacement: method},
                        {holder: "{2}", replacement: current.detail.amountFrom.toString()},
                        {holder: "{3}", replacement: current.detail.amountTo.toString()},
                        {holder: "{4}", replacement: next.detail.amountFrom.toString()},
                        {holder: "{5}", replacement: next.detail.amountTo.toString()},
                      ];

                  message = replacePlaceholders(languageData[messageKey] || defaultMessage, placeholders).join("");
                } else {
                  message = isGap
                    ? `Gap detected for FeeType '${feeType}', RefundMethod '${method}': [${current.detail.amountFrom},${current.detail.amountTo}] → [${next.detail.amountFrom},${next.detail.amountTo}]. Ranges must be continuous (next.AmountFrom must equal prev.AmountTo).`
                    : `Should be equals to ${current.detail.amountTo}`;
                }

                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message,
                  path: [next.index, "amountFrom"],
                });
              }
            }
          }
        }
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
      refundFeeDetails: refundFeeDetailsArraySchema,
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
    refundFeeDetails: refundFeeDetailsArraySchema,
  });

  return {createFormSchema, updateFormSchema};
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
