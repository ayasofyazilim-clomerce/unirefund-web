import {
  InvoiceSummaryCard,
  MerchantInformationCard,
  PageHeader,
  TagInformationCard,
  TravellerInformationCard,
  type SSRServiceResource,
  type UniRefund_TagService_Tags_TagDetailDto,
  type UniRefund_TagService_Tags_TagEarningDto,
  type UniRefund_TagService_Tags_TagTotalDto,
} from "../components";

interface TagDetailClientProps {
  languageData: SSRServiceResource;
  tagsResponse: UniRefund_TagService_Tags_TagDetailDto;
  lang: string;
}

/**
 * Computes the refund amount from various sources
 */
function computeRefundAmount(
  totals?: UniRefund_TagService_Tags_TagTotalDto[] | null,
  earnings?: UniRefund_TagService_Tags_TagEarningDto[] | null,
) {
  // Try to find refund amount from totals
  const refundFromTotals = totals?.find(
    (t) => typeof t.totalType === "string" && t.totalType.toLowerCase().includes("refund"),
  )?.amount;

  if (refundFromTotals !== undefined) return refundFromTotals;

  // Try to find refund amount from earnings
  const refundFromEarnings = earnings?.find(
    (e) => typeof e.earningType === "string" && e.earningType.toLowerCase().includes("refund"),
  )?.amount;

  if (refundFromEarnings !== undefined) return refundFromEarnings;

  // Fallback: sum of all earnings
  if (earnings?.length) {
    return earnings.reduce((sum, earning) => sum + earning.amount, 0);
  }

  return undefined;
}

export default function TagDetailClient({languageData, tagsResponse, lang}: TagDetailClientProps) {
  const {merchant, traveller, invoices, totals, earnings} = tagsResponse;
  const refundAmount = computeRefundAmount(totals, earnings);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <PageHeader languageData={languageData} tagNumber={tagsResponse.tagNumber} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content Area */}
        <div className="space-y-6 lg:col-span-2">
          <TagInformationCard
            issueDate={tagsResponse.issueDate}
            languageData={languageData}
            locale={lang}
            status={tagsResponse.status}
            tagNumber={tagsResponse.tagNumber}
          />

          <MerchantInformationCard languageData={languageData} merchant={merchant} />

          <TravellerInformationCard languageData={languageData} traveller={traveller} />
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <InvoiceSummaryCard invoices={invoices} languageData={languageData} refundAmount={refundAmount} />
        </aside>
      </div>
    </div>
  );
}
