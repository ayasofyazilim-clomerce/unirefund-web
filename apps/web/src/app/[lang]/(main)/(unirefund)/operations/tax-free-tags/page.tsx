"use server";

import type { GetApiTagServiceTagData } from "@ayasofyazilim/saas/TagService";
import { CreditCard, DollarSign, Tags } from "lucide-react";
import {
  getTagsApi,
  getTagSummaryApi,
} from "src/actions/unirefund/TagService/actions";
import { getResourceData } from "src/language-data/unirefund/TagService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import { localizeCurrency } from "src/utils/utils-number";
import { TagSummary } from "../_components/tag-summary";
import TaxFreeTagsTable from "./_components/table";

export default async function Page({
  params,
  searchParams,
}: {
  params: { lang: string };
  searchParams?: GetApiTagServiceTagData;
}) {
  await isUnauthorized({
    requiredPolicies: ["TagService.Tags"],
    lang: params.lang,
  });

  const tagsResponse = await getTagsApi(searchParams);
  if (isErrorOnRequest(tagsResponse, params.lang)) return;

  const tagSummaryResponse = await getTagSummaryApi(searchParams);
  if (isErrorOnRequest(tagSummaryResponse, params.lang)) return;

  const { languageData } = await getResourceData(params.lang);

  const currencyFormatter = localizeCurrency(params.lang);
  const summary = tagSummaryResponse.data;
  return (
    <div>
      <div className="mb-3 grid grid-cols-3 gap-4">
        <TagSummary
          icon={<Tags className="size-4" />}
          title={languageData.TotalTags}
          value={tagsResponse.data.totalCount || 0}
        />
        <TagSummary
          icon={<DollarSign className="size-4" />}
          title={languageData.Sales}
          value={currencyFormatter(
            summary.totalSalesAmount || 0,
            summary.currency || "TRY",
          )}
        />
        <TagSummary
          icon={<CreditCard className="size-4" />}
          title={languageData.Refunds}
          value={currencyFormatter(
            summary.totalRefundAmount || 0,
            summary.currency || "TRY",
          )}
        />
      </div>
      <TaxFreeTagsTable
        languageData={languageData}
        response={tagsResponse.data}
      />
    </div>
  );
}
