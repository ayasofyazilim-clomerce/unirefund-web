import { Card, CardHeader } from "@/components/ui/card";
import type { UniRefund_FinanceService_VATStatementHeaders_VATStatementHeaderDetailDto } from "@ayasofyazilim/saas/FinanceService";
import type { FinanceServiceResource } from "src/language-data/unirefund/FinanceService";

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
      <div className="mb-9 text-3xl font-medium">{summaryList.title}</div>
      {summaryList.rows.map((row) => (
        <div className="flex flex-row gap-5" key={row.title}>
          <div className="text-gray-500">{row.title}:</div>
          {row.content}
        </div>
      ))}
    </div>
  );
}

export default function VatStatementInformation({
  languageData,
  VatStatementData,
}: {
  VatStatementData: UniRefund_FinanceService_VATStatementHeaders_VATStatementHeaderDetailDto;
  languageData: FinanceServiceResource;
}) {
  const firstColumn: SummaryListType = {
    title: VatStatementData.status,
    rows: [
      {
        title: languageData["VatStatement.MerchantName"],
        content: VatStatementData.merchantName,
      },
      {
        title: languageData["VatStatement.Status"],
        content: VatStatementData.status,
      },
      {
        title: languageData["VatStatement.Total"],
        content: VatStatementData.total.toString(),
      },
      {
        title: languageData["VatStatement.BillingPeriod"],
        content: VatStatementData.billingPeriod,
      },
    ],
  };
  const secondColumn: SummaryListType = {
    rows: [
      {
        title: languageData["VatStatement.InvoiceNumber"],
        content: VatStatementData.invoiceNumber,
      },
      {
        title: languageData["VatStatement.VatStatementDate"],
        content: VatStatementData.vatStatementDate,
      },
      {
        title: languageData["VatStatement.ReferenceDateBegin"],
        content: VatStatementData.referenceDateBegin,
      },
      {
        title: languageData["VatStatement.TermOfPayment"],
        content: VatStatementData.termOfPayment.toString(),
      },
      {
        title: languageData["VatStatement.DeliveryMethod"],
        content: VatStatementData.deliveryMethod,
      },
    ],
  };
  const thirdColumn: SummaryListType = {
    rows: [
      {
        title: languageData["VatStatement.CustomerNumber"],
        content: VatStatementData.customerNumber || "",
      },
      {
        title: languageData["VatStatement.DueDate"],
        content: VatStatementData.dueDate,
      },
      {
        title: languageData["VatStatement.ReferenceDateEnd"],
        content: VatStatementData.referenceDateEnd,
      },
      {
        title: languageData["VatStatement.ReferenceNumber"],
        content: VatStatementData.referenceNumber || "",
      },
      {
        title: languageData["VatStatement.YourReference"],
        content: VatStatementData.yourReference || "",
      },
    ],
  };
  return (
    <Card className="flex-1 rounded-none">
      <CardHeader className="py-4">
        <div className="flex flex-row gap-4">
          <SummaryList summaryList={firstColumn} />
          <SummaryList summaryList={secondColumn} />
          <SummaryList summaryList={thirdColumn} />
        </div>
      </CardHeader>
    </Card>
  );
}
