import {Card, CardHeader} from "@/components/ui/card";
import type {UniRefund_FinanceService_VATStatementHeaders_VATStatementHeaderDetailDto} from "@ayasofyazilim/saas/FinanceService";
import {dateToString} from "@/app/[lang]/(main)/(unirefund)/operations/_components/utils";
import type {FinanceServiceResource} from "src/language-data/unirefund/FinanceService";

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
      {summaryList.title ? <div className="mb-4 text-5xl font-medium">{summaryList.title}</div> : null}
      {summaryList.rows.map((row) => (
        <div className="mb-2 flex flex-row gap-2" key={row.title}>
          <div>{row.title}:</div>
          <div className="font-semibold">{row.content || "-"}</div>
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
        content: dateToString(VatStatementData.vatStatementDate, "tr"),
      },
      {
        title: languageData["VatStatement.ReferenceDateBegin"],
        content: dateToString(VatStatementData.referenceDateBegin, "tr"),
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
        content: VatStatementData.customerNumber || "-",
      },
      {
        title: languageData["VatStatement.DueDate"],
        content: dateToString(VatStatementData.dueDate, "tr"),
      },
      {
        title: languageData["VatStatement.ReferenceDateEnd"],
        content: dateToString(VatStatementData.referenceDateEnd, "tr"),
      },
      {
        title: languageData["VatStatement.ReferenceNumber"],
        content: VatStatementData.referenceNumber || "-",
      },
      {
        title: languageData["VatStatement.YourReference"],
        content: VatStatementData.yourReference || "-",
      },
    ],
  };

  return (
    <Card className="flex-1 rounded-none p-4 shadow-md">
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
