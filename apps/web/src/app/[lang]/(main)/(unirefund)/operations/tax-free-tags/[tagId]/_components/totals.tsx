"use client";
import type { UniRefund_TagService_Tags_TagDetailDto } from "@ayasofyazilim/saas/TagService";
import InfoCard from "@repo/ayasofyazilim-ui/molecules/infocard";
import { DollarSign } from "lucide-react";
import { useParams } from "next/navigation";
import type { TagServiceResource } from "src/language-data/unirefund/TagService";
import { localizeCurrency } from "src/utils/utils-number";

function Totals({
  languageData,
  tagDetail,
}: {
  tagDetail: UniRefund_TagService_Tags_TagDetailDto;
  languageData: TagServiceResource;
}) {
  const params = useParams<{ lang: "en" }>();
  const currencyFormatter = localizeCurrency(params.lang);
  return (
    <div className="flex flex-col gap-2">
      {tagDetail.totals?.map((total) => (
        <InfoCard
          className="flex-1 rounded-none"
          content={currencyFormatter(
            total.amount || 0,
            total.currency || "TRY",
          )}
          icon={<DollarSign className="size-4" />}
          key={total.totalType}
          title={languageData[total.totalType]}
        />
      ))}
    </div>
  );
}

export default Totals;
