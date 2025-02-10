"use client";
import {Card, CardHeader} from "@/components/ui/card";
import type {UniRefund_FinanceService_RebateStatementHeaders_RebateStatementHeaderDetailDto} from "@ayasofyazilim/saas/FinanceService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import {useGrantedPolicies} from "@repo/utils/policies";
import {useParams} from "next/navigation";
import {dateToString} from "@/app/[lang]/(main)/(unirefund)/operations/_components/utils";
import type {FinanceServiceResource} from "src/language-data/unirefund/FinanceService";
import {tableData} from "./rebate-information-table-data";

interface SummaryListType {
  title?: string;
  rows: {
    title: string;
    content?: string;
  }[];
}

function SummaryList({summaryList}: {summaryList: SummaryListType}) {
  return (
    <div className="mt-2 flex w-1/3 flex-col">
      {summaryList.rows.map((row) => (
        <div className=" mb-2 flex flex-row gap-2 " key={row.title}>
          <div>{row.title}:</div>
          <div className="font-semibold">{row.content || "-"}</div>
        </div>
      ))}
    </div>
  );
}

export default function RebateStatementInformation({
  languageData,
  rebateStatementData,
}: {
  rebateStatementData: UniRefund_FinanceService_RebateStatementHeaders_RebateStatementHeaderDetailDto;
  languageData: FinanceServiceResource;
}) {
  const {grantedPolicies} = useGrantedPolicies();
  const {lang} = useParams<{lang: string}>();

  const columns = tableData.rebateInformation.columns(lang, languageData, grantedPolicies);
  const table = tableData.rebateInformation.table();

  const firstColumn: SummaryListType = {
    title: rebateStatementData.status,
    rows: [
      {
        title: languageData["RebateStatement.MerchantName"],
        content: rebateStatementData.merchantName,
      },
      {
        title: languageData["RebateStatement.Status"],
        content: rebateStatementData.status,
      },
      {
        title: languageData["RebateStatement.Total"],
        content: rebateStatementData.total.toString(),
      },
      {
        title: languageData["RebateStatement.CustomerNumber"],
        content: rebateStatementData.customerNumber || "",
      },
    ],
  };
  const secondColumn: SummaryListType = {
    rows: [
      {
        title: languageData["RebateStatement.Number"],
        content: rebateStatementData.number,
      },
      {
        title: languageData["RebateStatement.RebateStatementDate"],
        content: dateToString(rebateStatementData.rebateStatementDate, "tr"),
      },
      {
        title: languageData["RebateStatement.Period"],
        content: rebateStatementData.period,
      },
    ],
  };

  return (
    <div className="max-h-[calc(100vh-200px)] w-full overflow-y-auto pt-4">
      <Card className="flex-1  rounded-none p-4">
        <CardHeader className="py-4">
          <div className="flex flex-row justify-between gap-6">
            <SummaryList summaryList={firstColumn} />
            <SummaryList summaryList={secondColumn} />
          </div>
        </CardHeader>
        <TanstackTable
          {...table}
          columns={columns}
          data={rebateStatementData.rebateStatementStoreDetails || []}
          rowCount={1}
        />
      </Card>
    </div>
  );
}
