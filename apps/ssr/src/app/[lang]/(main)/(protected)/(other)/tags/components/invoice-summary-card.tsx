import {Button} from "@/components/ui/button";
import type {UniRefund_TagService_Invoices_InvoiceDto} from "@repo/saas/TagService";
import {Download, Receipt} from "lucide-react";

interface InvoiceSummaryCardProps {
  invoices?: UniRefund_TagService_Invoices_InvoiceDto[] | null;
  refundAmount?: number | null;
  languageData: Record<string, string>;
}

function formatCurrency(amount?: number | null, currency?: string | null) {
  if (amount === null || amount === undefined) return "—";
  const cur = currency ?? "TRY";
  return new Intl.NumberFormat(undefined, {style: "currency", currency: cur, maximumFractionDigits: 2}).format(amount);
}

export function InvoiceSummaryCard({invoices, refundAmount, languageData}: InvoiceSummaryCardProps) {
  const firstInvoice = invoices?.length ? invoices[0] : null;

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className="mb-4 flex items-center gap-3 border-b pb-2">
        <Receipt className="h-5 w-5 text-orange-600" />
        <h3 className="text-lg font-semibold text-slate-800">{languageData["InvoiceSummary.Title"]}</h3>
      </div>

      <div className="space-y-4">
        <div>
          <div className="text-sm font-medium text-gray-500">{languageData["InvoiceSummary.InvoiceNumber"]}</div>
          <div className="text-md font-semibold text-gray-800">{firstInvoice?.number ?? "—"}</div>
        </div>

        <div className="flex-1">
          <div className="text-sm font-medium text-gray-500">{languageData["InvoiceSummary.TotalAmount"]}</div>
          <div className="text-md font-semibold text-gray-800">
            {firstInvoice ? formatCurrency(firstInvoice.totalAmount, firstInvoice.currency) : "—"}
          </div>
        </div>

        <div className="text-sm">
          <div className="text-sm font-medium text-gray-500">{languageData["InvoiceSummary.TaxAmount"]}</div>
          <div className="text-md font-semibold text-gray-800">
            {firstInvoice ? formatCurrency(firstInvoice.vatAmount, firstInvoice.currency) : "—"}
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-500">{languageData["InvoiceSummary.RefundAmount"]}</div>
              <div className="text-md font-semibold text-gray-800">
                {refundAmount !== null && refundAmount !== undefined
                  ? formatCurrency(refundAmount, firstInvoice?.currency)
                  : "—"}
              </div>
            </div>
          </div>
        </div>

        <Button className="flex w-full gap-2" variant="default">
          <Download className="h-4 w-4" />
          {languageData["InvoiceSummary.DownloadPDF"]}
        </Button>
      </div>
    </div>
  );
}
