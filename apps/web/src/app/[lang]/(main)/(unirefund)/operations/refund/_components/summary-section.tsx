"use client";

import type {TagServiceResource} from "src/language-data/unirefund/TagService";
import {TagSummary} from "../../_components/tag-summary";

export interface TotalDataOfSelectedTagsType {
  refund?: string | number;
  refundFee?: string | number;
  salesAmount?: string | number;
  vatAmount?: string | number;
  grossRefund?: string | number;
}
export default function SummarySection({
  languageData,
  totalDataOfSelectedTags,
}: {
  languageData: TagServiceResource;
  totalDataOfSelectedTags: TotalDataOfSelectedTagsType;
}) {
  return (
    <div className="grid grid-cols-5 gap-6">
      <TagSummary title={languageData.SalesAmount} value={totalDataOfSelectedTags.salesAmount || 0} />
      <TagSummary title={languageData.VatAmount} value={totalDataOfSelectedTags.vatAmount || 0} />
      <TagSummary title={languageData.GrossRefund} value={totalDataOfSelectedTags.grossRefund || 0} />

      <TagSummary
        textColor="text-red-500"
        title={languageData.RefundFee}
        value={totalDataOfSelectedTags.refundFee || 0}
      />
      <TagSummary textColor="text-green-500" title={languageData.Refund} value={totalDataOfSelectedTags.refund || 0} />
    </div>
  );
}
