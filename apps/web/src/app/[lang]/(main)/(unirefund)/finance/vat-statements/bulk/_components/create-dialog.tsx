"use client";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Button} from "@/components/ui/button";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {postVatStatementHeaderApi} from "@repo/actions/unirefund/FinanceService/post-actions";
import type {UniRefund_FinanceService_VATStatementHeaders_VATStatementHeaderBulkPreviewDto as VATStatementHeaderBulkPreviewDto} from "@repo/saas/FinanceService";
import {CheckCircle2, LoaderCircle, XCircle} from "lucide-react";
import type {Dispatch, SetStateAction} from "react";
import {useEffect, useState} from "react";
import type {BasePropType} from "./client";

export type MerchantStatus = {
  status: "pending" | "success" | "error";
  error?: string;
} & VATStatementHeaderBulkPreviewDto;

export default function CreateStatementsModal({
  selectedRows,
  monthYearPair,
  languageData,
  isPending,
  setFormKey,
}: {selectedRows: VATStatementHeaderBulkPreviewDto[]; setFormKey: Dispatch<SetStateAction<number>>} & Pick<
  BasePropType,
  "languageData" | "monthYearPair" | "isPending"
>) {
  const [open, setOpen] = useState(false);
  const [statuses, setStatuses] = useState<MerchantStatus[]>([]);

  const handleStart = () => {
    setOpen(true);
    setStatuses(
      selectedRows.map((row) => ({
        ...row,
        status: "pending",
      })),
    );
  };

  useEffect(() => {
    if (open && statuses.length > 0) {
      statuses.forEach((_, idx) => {
        const row = selectedRows[idx];
        void postVatStatementHeaderApi({
          requestBody: {
            merchantId: row.merchantId || "",
            ...monthYearPair,
            vatStatementDate: new Date().toISOString(),
          },
        }).then((res) => {
          setStatuses((prev) =>
            prev.map((s, i) => {
              if (i === idx) {
                if (res.type === "success") {
                  return {...s, status: "success"};
                }
                return {...s, status: "error", error: res.message};
              }
              return s;
            }),
          );
        });
      });
    }
  }, [open, statuses.length, selectedRows, monthYearPair]);

  const handleOpenChange = () => {
    setOpen(false);
    setFormKey(new Date().getTime());
  };

  return (
    <>
      <Button data-testid="create-statements" disabled={selectedRows.length === 0 || isPending} onClick={handleStart}>
        {languageData["Finance.createStatement"]}
      </Button>
      <Sheet onOpenChange={handleOpenChange} open={open}>
        <SheetContent aria-describedby={languageData["Finance.createStatement"]} className="px-2">
          <SheetHeader>
            <SheetTitle>{languageData["Finance.createStatements"]}</SheetTitle>
            <SheetDescription className="sr-only">{languageData["Finance.createStatements"]}</SheetDescription>
          </SheetHeader>
          <div className="mt-4 h-full space-y-2 overflow-auto">
            {statuses.map((row, idx) => {
              let variant: "success" | "default" | "destructive" | "information" = "default";
              switch (row.status) {
                case "error":
                  variant = "destructive";
                  break;
                case "pending":
                  variant = "information";
                  break;
                case "success":
                  variant = "success";
                  break;
              }
              return (
                <Alert key={row.merchantId || `${idx}`} variant={variant}>
                  {row.status === "pending" && <LoaderCircle className="size-4 min-w-4 animate-spin text-blue-500" />}
                  {row.status === "success" && <CheckCircle2 className="size-4 min-w-4" />}
                  {row.status === "error" && <XCircle className="size-4 min-w-4" />}
                  <AlertTitle className="truncate">{row.merchantName}</AlertTitle>
                  <AlertDescription>
                    {row.status === "pending" && languageData["Finance.createStatement.pending"]}
                    {row.status === "success" && languageData["Finance.createStatement.success"]}
                    {row.status === "error" && row.error}
                  </AlertDescription>
                </Alert>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
