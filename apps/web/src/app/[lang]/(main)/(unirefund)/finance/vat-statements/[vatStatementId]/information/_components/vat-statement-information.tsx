import {Card, CardContent, CardHeader} from "@/components/ui/card";
import type {UniRefund_FinanceService_VATStatementHeaders_VATStatementHeaderDetailDto} from "@ayasofyazilim/saas/FinanceService";
import {dateToString} from "@/app/[lang]/(main)/(unirefund)/operations/_components/utils";
import type {FinanceServiceResource} from "src/language-data/unirefund/FinanceService";

interface InformationItemProps {
  label: string;
  value: string | null | undefined;
  highlight?: boolean;
}

function InformationItem({label, value, highlight}: InformationItemProps) {
  return (
    <div className="flex flex-col">
      <span className="text-sm text-gray-500">{label}</span>
      <span className={`font-medium ${highlight ? "text-primary text-lg" : ""}`}>{value || "-"}</span>
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
  const formatCurrency = (value: number | undefined) => {
    if (value === undefined) return "-";
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "EUR",
    }).format(value);
  };

  const getStatusColor = (status: string | undefined) => {
    if (!status) return "text-gray-600";

    switch (status) {
      case "Sent":
        return "text-blue-600";
      case "Cancelled":
        return "text-red-600";
      case "DebtCollection":
        return "text-amber-600";
      case "CreditNote":
        return "text-green-600";
      case "PaymentReminder1":
      case "PaymentReminder2":
      case "PaymentReminder3":
        return "text-orange-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="border-b pb-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">{languageData["VatStatement.Information"] || "Information"}</h2>
          <span className={`rounded-md px-3 py-1 font-bold ${getStatusColor(VatStatementData.status)}`}>
            {VatStatementData.status}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-5">
        <div className="grid grid-cols-2 gap-x-12 gap-y-8 md:grid-cols-3">
          <InformationItem
            highlight
            label={languageData["VatStatement.MerchantName"]}
            value={VatStatementData.merchantName}
          />
          <InformationItem label={languageData["VatStatement.InvoiceNumber"]} value={VatStatementData.invoiceNumber} />
          <InformationItem
            label={languageData["VatStatement.CustomerNumber"]}
            value={VatStatementData.customerNumber || "-"}
          />

          <InformationItem
            highlight
            label={languageData["VatStatement.Total"]}
            value={formatCurrency(VatStatementData.total)}
          />
          <InformationItem
            label={languageData["VatStatement.VatStatementDate"]}
            value={VatStatementData.vatStatementDate ? dateToString(VatStatementData.vatStatementDate, "tr") : "-"}
          />
          <InformationItem
            highlight={Boolean(VatStatementData.dueDate)}
            label={languageData["VatStatement.DueDate"]}
            value={VatStatementData.dueDate ? dateToString(VatStatementData.dueDate, "tr") : "-"}
          />

          <InformationItem label={languageData["VatStatement.BillingPeriod"]} value={VatStatementData.billingPeriod} />
          <InformationItem
            label={languageData["VatStatement.ReferenceDateBegin"]}
            value={VatStatementData.referenceDateBegin ? dateToString(VatStatementData.referenceDateBegin, "tr") : "-"}
          />
          <InformationItem
            label={languageData["VatStatement.ReferenceDateEnd"]}
            value={VatStatementData.referenceDateEnd ? dateToString(VatStatementData.referenceDateEnd, "tr") : "-"}
          />

          <InformationItem
            label={languageData["VatStatement.TermOfPayment"]}
            value={VatStatementData.termOfPayment ? `${VatStatementData.termOfPayment}` : "-"}
          />
          <InformationItem
            label={languageData["VatStatement.ReferenceNumber"]}
            value={VatStatementData.referenceNumber || "-"}
          />
          <InformationItem
            label={languageData["VatStatement.YourReference"]}
            value={VatStatementData.yourReference || "-"}
          />

          <InformationItem
            label={languageData["VatStatement.DeliveryMethod"]}
            value={VatStatementData.deliveryMethod}
          />
        </div>
      </CardContent>
    </Card>
  );
}
