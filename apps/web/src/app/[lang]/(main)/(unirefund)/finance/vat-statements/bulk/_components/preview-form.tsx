"use client";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {toast} from "@/components/ui/sonner";
import {postVatStatementHeadersFormBulkPreviewApi} from "@repo/actions/unirefund/FinanceService/post-actions";
import type {UniRefund_FinanceService_VATStatementHeaders_VATStatementHeaderBulkPreviewDto as VATStatementHeaderBulkPreviewDto} from "@repo/saas/FinanceService";
import type {Dispatch, SetStateAction} from "react";
import type {BasePropType, MonthYearPair} from "./client";

export default function PreviewForm({
  languageData,
  setStatements,
  isPending,
  startTransition,
  monthYearPair,
  setMonthYearPair,
}: BasePropType & {
  setStatements: Dispatch<SetStateAction<VATStatementHeaderBulkPreviewDto[]>>;
  setMonthYearPair: Dispatch<SetStateAction<MonthYearPair>>;
}) {
  return (
    <div className="flex gap-2">
      <Input
        data-testid="preview-statements-year"
        disabled={isPending}
        max={new Date().getFullYear() + 1}
        min={2020}
        onChange={(e) => {
          setMonthYearPair((prev) => {
            return {...prev, year: e.target.valueAsNumber};
          });
        }}
        step="1"
        type="number"
        value={monthYearPair.year}
      />
      <Input
        data-testid="preview-statements-month"
        disabled={isPending}
        max={12}
        min={1}
        onChange={(e) => {
          setMonthYearPair((prev) => {
            return {...prev, month: e.target.valueAsNumber};
          });
        }}
        step="1"
        type="number"
        value={monthYearPair.month}
      />
      <Button
        data-testid="preview-statements-button"
        disabled={isPending}
        onClick={() => {
          startTransition(() => {
            setStatements([]);
            void postVatStatementHeadersFormBulkPreviewApi({requestBody: monthYearPair}).then((res) => {
              if (res.type === "success") {
                setStatements(res.data);
              } else {
                toast.error(res.message);
              }
            });
          });
        }}>
        {languageData["Finance.Preview"]}
      </Button>
    </div>
  );
}
