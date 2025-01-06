"use client";
import { Card, CardHeader } from "@/components/ui/card";
import type { UniRefund_FinanceService_RebateStatementHeaders_RebateStatementHeaderDetailDto } from "@ayasofyazilim/saas/FinanceService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import { useParams } from "next/navigation";
import type { FinanceServiceResource } from "src/language-data/unirefund/FinanceService";
import { useGrantedPolicies } from "src/providers/granted-policies";
import { tableData } from "./rebate-information-table-data";

interface SummaryListType {
  title?: string;
  rows: {
    title: string;
    content?: string;
  }[];
}

function SummaryList({ summaryList }: { summaryList: SummaryListType }) {
  return (
    <div className="mt-2 flex w-1/3 flex-col">
      {summaryList.rows.map((row) => (
        <div className="flex flex-row gap-2" key={row.title}>
          <div className="text-gray-500">{row.title}:</div>
          {row.content}
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
  const { grantedPolicies } = useGrantedPolicies();
  const { lang } = useParams<{ lang: string }>();

  const columns = tableData.rebateInformation.columns(
    lang,
    languageData,
    grantedPolicies,
  );
  const table = tableData.rebateInformation.table();

  const firstColumn: SummaryListType = {
    title: rebateStatementData.status,
    rows: [
      {
        title: "Merchant Name",
        content: rebateStatementData.merchantName,
      },
      {
        title: "total",
        content: rebateStatementData.total.toString(),
      },
    ],
  };
  const secondColumn: SummaryListType = {
    rows: [
      {
        title: "number",
        content: rebateStatementData.number,
      },
      {
        title: "status",
        content: rebateStatementData.status,
      },
    ],
  };
  const thirdColumn: SummaryListType = {
    rows: [
      {
        title: "customerNumber",
        content: rebateStatementData.customerNumber || "",
      },
      {
        title: "date",
        content: rebateStatementData.rebateStatementDate || "",
      },
    ],
  };
  const fourthColumn: SummaryListType = {
    rows: [
      {
        title: "period",
        content: rebateStatementData.period,
      },
    ],
  };

  return (
    <Card className="p flex-1 rounded-none">
      <CardHeader className="py-4">
        <div className="flex flex-row gap-8">
          <SummaryList summaryList={firstColumn} />
          <SummaryList summaryList={secondColumn} />
          <SummaryList summaryList={thirdColumn} />
          <SummaryList summaryList={fourthColumn} />
        </div>
      </CardHeader>
      <TanstackTable
        {...table}
        columns={columns}
        data={rebateStatementData.rebateStatementStoreDetails || []}
        rowCount={rebateStatementData.rebateStatementStoreDetails?.length || 0}
      />
    </Card>
  );
}
