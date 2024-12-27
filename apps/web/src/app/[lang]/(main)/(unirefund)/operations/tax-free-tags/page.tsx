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
import ErrorComponent from "../../../_components/error-component";
import { TagSummary } from "../_components/tag-summary";
import TaxFreeTagsTable from "./_components/table";

export default async function Page({
  params,
  searchParams,
}: {
  params: { lang: string };
  searchParams: GetApiTagServiceTagData;
}) {
  const { lang } = params;
  await isUnauthorized({
    requiredPolicies: ["TagService.Tags"],
    lang,
  });

  const { languageData } = await getResourceData(lang);

  const tagsResponse = await getTagsApi(searchParams);
  if (isErrorOnRequest(tagsResponse, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={tagsResponse.message}
      />
    );
  }

  const tagSummaryResponse = await getTagSummaryApi(searchParams);
  if (isErrorOnRequest(tagSummaryResponse, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={tagSummaryResponse.message}
      />
    );
  }

  const currencyFormatter = localizeCurrency(lang);
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
