import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {AlertTriangle} from "lucide-react";
import {replacePlaceholders} from "@repo/ayasofyazilim-ui/lib/replace-placeholders";
import {cn} from "@/lib/utils";
import type {ContractServiceResource} from "@/language-data/unirefund/ContractService";
import type {RefundFeeDetail, ValidationError} from "./schema";

interface RefundFeeDetailsVisualizerProps {
  languageData: ContractServiceResource;
  details: RefundFeeDetail[];
  onCellClick?: (groupKey: string, rangeIndex: number) => void;
}

export function RefundFeeDetailsVisualizer({languageData, details, onCellClick}: RefundFeeDetailsVisualizerProps) {
  if (details.length === 0) {
    return null;
  }

  const groups = new Map<string, RefundFeeDetail[]>();
  const groupErrors = new Map<string, ValidationError[]>();

  details.forEach((detail, originalIndex) => {
    const key = `${detail.feeType}-${detail.refundMethod}`;
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)?.push({...detail, originalIndex});
  });

  groups.forEach((groupDetails, groupKey) => {
    const errors: ValidationError[] = [];
    if (groupDetails.length > 0 && groupDetails[0].amountFrom !== 0) {
      errors.push({
        type: "missing_start",
        message: replacePlaceholders(
          languageData["RefundFeeTable.Form.refundFeeDetails.groupMustStartFromZeroButStartsFrom{0}"],
          [
            {
              holder: "{0}",
              replacement: groupDetails[0].amountFrom,
            },
          ],
        ).join(""),
        affectedRanges: [0],
        groupKey,
      });
    }

    for (let i = 1; i < groupDetails.length; i++) {
      const prev = groupDetails[i - 1];
      const current = groupDetails[i];

      if (current.amountFrom > prev.amountTo) {
        errors.push({
          type: "gap",
          message: replacePlaceholders(languageData["RefundFeeTable.Form.refundFeeDetails.gapBetween{0}and{1}"], [
            {
              holder: "{0}",
              replacement: prev.amountTo,
            },
            {
              holder: "{1}",
              replacement: current.amountFrom,
            },
          ]).join(""),
          affectedRanges: [i - 1, i],
          groupKey,
        });
      } else if (current.amountFrom < prev.amountTo) {
        errors.push({
          type: "overlap",
          message: replacePlaceholders(
            languageData["RefundFeeTable.Form.refundFeeDetails.overlap{0}-{1}overlapsWith{2}-{3}"],
            [
              {
                holder: "{0}",
                replacement: prev.amountFrom,
              },
              {
                holder: "{1}",
                replacement: prev.amountTo,
              },
              {
                holder: "{2}",
                replacement: current.amountFrom,
              },
              {
                holder: "{3}",
                replacement: current.amountTo,
              },
            ],
          ).join(""),
          affectedRanges: [i - 1, i],
          groupKey,
        });
      }
    }

    // Check for invalid ranges (amountFrom >= amountTo)
    groupDetails.forEach((detail, index) => {
      if (detail.amountFrom >= detail.amountTo) {
        errors.push({
          type: "invalid_range",
          message: replacePlaceholders(
            languageData["RefundFeeTable.Form.refundFeeDetails.invalidRange{0}mustBeLessThan{1}"],
            [
              {
                holder: "{0}",
                replacement: detail.amountTo,
              },
              {
                holder: "{1}",
                replacement: detail.amountFrom,
              },
            ],
          ).join(""),
          affectedRanges: [index],
          groupKey,
        });
      }
    });

    if (errors.length > 0) {
      groupErrors.set(groupKey, errors);
    }
  });

  const handleRangeClick = (groupKey: string, rangeIndex: number) => {
    if (onCellClick) {
      onCellClick(groupKey, rangeIndex);
    }
  };
  return (
    <div className="grid gap-2">
      {Array.from(groups.entries()).map(([groupKey, groupDetails]) => {
        const [feeType, refundMethod] = groupKey.split("-");
        const errors = groupErrors.get(groupKey) || [];
        const isValidGroup = errors.length === 0;

        return (
          <div
            className={`flex flex-wrap gap-2 rounded-md border p-2 shadow-none ${
              isValidGroup ? "border-green-200 bg-green-50/30" : "border-red-200 bg-red-50/30"
            }`}
            key={groupKey}>
            <Badge className="text-xs" variant={isValidGroup ? "outline" : "destructive"}>
              {feeType} & {refundMethod}
            </Badge>
            <div className="flex flex-wrap gap-1">
              {groupDetails.map((detail, index) => {
                const hasError = errors.some((error) => error.affectedRanges.includes(index));

                return (
                  <Button
                    className={cn(
                      `border text-xs shadow-none transition-colors hover:bg-transparent`,
                      hasError && "cursor-pointer border-red-300 bg-red-100 text-red-800",
                      hasError && isValidGroup && "border-green-300 bg-green-100 text-green-800",
                      hasError && !isValidGroup && "bg-muted border-muted-foreground/50 text-muted-foreground",
                    )}
                    data-testid={groupKey + index}
                    key={groupKey + index}
                    onClick={() => {
                      handleRangeClick(groupKey, index);
                    }}
                    size="sm"
                    title={hasError ? "Click to focus on this range in the table" : ""}
                    type="button">
                    {detail.amountFrom} - {detail.amountTo}
                  </Button>
                );
              })}
            </div>
            {errors.length > 0 && (
              <div className="w-full space-y-1">
                {errors.map((error, index) => (
                  <div className="flex items-start gap-1 text-xs text-red-600" key={index}>
                    <AlertTriangle className="mt-0.5 h-3 w-3 flex-shrink-0" />
                    <span>{error.message}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
