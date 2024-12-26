"use client";

import type { TagServiceResource } from "src/language-data/unirefund/TagService";
import { TagSummary } from "../../_components/tag-summary";

export default function SummarySection({
  languageData,
  totalDataOfSelectedTags,
}: {
  languageData: TagServiceResource;
  totalDataOfSelectedTags: {
    refund: string | number;
    refundFee: string | number;
    salesAmount: string | number;
    vatAmount: string | number;
    grossRefund: string | number;
  };
}) {
  return (
    <div className="mb-2 grid grid-cols-5 gap-5">
      <TagSummary
        title={languageData.SalesAmount}
        value={totalDataOfSelectedTags.salesAmount}
      />
      <TagSummary
        title={languageData.VatAmount}
        value={totalDataOfSelectedTags.vatAmount}
      />
      <TagSummary
        title={languageData.GrossRefund}
        value={totalDataOfSelectedTags.grossRefund}
      />

      <TagSummary
        textColor="text-red-500"
        title={languageData.RefundFee}
        value={totalDataOfSelectedTags.refundFee}
      />
      <TagSummary
        textColor="text-green-500"
        title={languageData.Refund}
        value={totalDataOfSelectedTags.refund}
      />
    </div>
  );
}
