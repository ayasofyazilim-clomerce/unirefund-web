"use client";

import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import type {UniRefund_FinanceService_VATStatementHeaders_VATStatementHeaderBulkPreviewDto as VATStatementHeaderBulkPreviewDto} from "@repo/saas/FinanceService";
import {$UniRefund_FinanceService_VATStatementHeaders_VATStatementHeaderBulkPreviewDto as $VATStatementHeaderBulkPreviewDto} from "@repo/saas/FinanceService";
import type {TransitionStartFunction} from "react";
import {useEffect, useState, useTransition} from "react";
import {useTenant} from "@/providers/tenant";
import type {FinanceServiceResource} from "@/language-data/unirefund/FinanceService";
import CreateStatementsModal from "./create-dialog";
import {DraftsTable} from "./drafts-table";
import PreviewForm from "./preview-form";

export type MonthYearPair = {
  month: number;
  year: number;
};

export type BasePropType = {
  languageData: FinanceServiceResource;
  isPending: boolean;
  startTransition: TransitionStartFunction;
  monthYearPair: MonthYearPair;
};

export default function Client({languageData}: {languageData: FinanceServiceResource}) {
  const {localization} = useTenant();
  const [formKey, setFormKey] = useState(0);
  const [selectedRows, setSelectedRows] = useState<VATStatementHeaderBulkPreviewDto[]>([]);
  const [monthYearPair, setMonthYearPair] = useState<MonthYearPair>({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [isPending, startTransition] = useTransition();
  const [statements, setStatements] = useState<VATStatementHeaderBulkPreviewDto[]>([]);
  const columns = tanstackTableCreateColumnsByRowData<VATStatementHeaderBulkPreviewDto>({
    rows: $VATStatementHeaderBulkPreviewDto.properties,
    localization,
    expandRowTrigger: "merchantName",
    languageData: {
      languageData,
      constantKey: "Finance",
    },
    selectableRows: true,
    onSelectedRowChange: (rows) => {
      setSelectedRows(rows);
    },
  });

  useEffect(() => {
    setSelectedRows([]);
    setMonthYearPair({
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    });
    setStatements([]);
  }, [formKey]);
  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex justify-between gap-2 border-b py-2">
        <PreviewForm
          isPending={isPending}
          languageData={languageData}
          monthYearPair={monthYearPair}
          setMonthYearPair={setMonthYearPair}
          setStatements={setStatements}
          startTransition={startTransition}
        />
        <CreateStatementsModal
          isPending={isPending}
          languageData={languageData}
          monthYearPair={monthYearPair}
          selectedRows={selectedRows}
          setFormKey={setFormKey}
        />
      </div>
      {statements.length !== 0 ? (
        <TanstackTable
          columnVisibility={{type: "show", columns: ["merchantName", "select"]}}
          columns={columns}
          data={statements}
          expandedRowComponent={(row) =>
            DraftsTable({
              drafts: row.drafts || [],
              languageData,
              monthYearPair,
              startTransition,
              isPending,
              merchantId: row.merchantId || "",
            })
          }
          fillerColumn="merchantName"
          resizeable={false}
        />
      ) : (
        <div className="text-muted-foreground flex size-full items-center justify-center">
          {languageData["Finance.vatStatements.empty"]}
        </div>
      )}
    </div>
  );
}
