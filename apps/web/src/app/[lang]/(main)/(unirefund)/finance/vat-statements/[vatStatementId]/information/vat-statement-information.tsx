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
        title: languageData["VatStatements.MerchantName"],
        content: VatStatementData.merchantName,
      },
      {
        title: languageData["VatStatements.Status"],
        content: VatStatementData.status,
      },
      {
        title: languageData["VatStatements.Total"],
        content: VatStatementData.total.toString(),
      },
      {
        title: languageData["VatStatements.BillingPeriod"],
        content: VatStatementData.billingPeriod,
      },
    ],
  };
  const secondColumn: SummaryListType = {
    rows: [
      {
        title: languageData["VatStatements.InvoiceNumber"],
        content: VatStatementData.invoiceNumber,
      },
      {
        title: languageData["VatStatements.VatStatementDate"],
        content: VatStatementData.vatStatementDate,
      },
      {
        title: languageData["VatStatements.ReferenceDateBegin"],
        content: VatStatementData.referenceDateBegin,
      },
      {
        title: languageData["VatStatements.TermOfPayment"],
        content: VatStatementData.termOfPayment.toString(),
      },
      {
        title: languageData["VatStatements.DeliveryMethod"],
        content: VatStatementData.deliveryMethod,
      },
    ],
  };
  const thirdColumn: SummaryListType = {
    rows: [
      {
        title: languageData["VatStatements.CustomerNumber"],
        content: VatStatementData.customerNumber || "",
      },
      {
        title: languageData["VatStatements.DueDate"],
        content: VatStatementData.dueDate,
      },
      {
        title: languageData["VatStatements.ReferenceDateEnd"],
        content: VatStatementData.referenceDateEnd,
      },
      {
        title: languageData["VatStatements.ReferenceNumber"],
        content: VatStatementData.referenceNumber || "",
      },
      {
        title: languageData["VatStatements.YourReference"],
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
