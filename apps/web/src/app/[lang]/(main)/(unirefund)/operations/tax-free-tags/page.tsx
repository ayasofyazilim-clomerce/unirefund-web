"use server";

import type {
  UniRefund_TagService_Tags_RefundType,
  UniRefund_TagService_Tags_TagStatusType,
} from "@ayasofyazilim/saas/TagService";
import { CreditCard, DollarSign, Tags } from "lucide-react";
import type { FilterComponentSearchItem } from "@repo/ayasofyazilim-ui/molecules/filter-component";
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
import Filter from "./_components/filter";
import TaxFreeTagsTable from "./_components/table";

interface SearchParamType {
  maxResultCount?: number;
  skipCount?: number;
  sorting?: string;

  exportStartDate?: string;
  invoiceNumber?: string;
  issuedEndDate?: string;
  issuedStartDate?: string;

  merchantIds?: string;
  paidEndDate?: string;
  paidStartDate?: string;
  refundTypes?: string;

  statuses?: string;
  tagNumber?: string;
  travellerDocumentNumber?: string;
  travellerFullName?: string;
  travellerIds?: string;
}

export default async function Page({
  params,
  searchParams,
}: {
  params: { lang: string };
  searchParams: SearchParamType;
}) {
  const { lang } = params;
  await isUnauthorized({
    requiredPolicies: ["TagService.Tags"],
    lang,
  });

  const { languageData } = await getResourceData(lang);

  const merchantIdsParsed = JSON.parse(
    searchParams.merchantIds || "[]",
  ) as FilterComponentSearchItem[];
  const merchantIds = merchantIdsParsed.map(
    (i: FilterComponentSearchItem) => i.id,
  );

  const tagData = {
    ...searchParams,
    merchantIds,
    statuses: searchParams.statuses?.split(
      ",",
    ) as UniRefund_TagService_Tags_TagStatusType[],
    refundTypes: searchParams.refundTypes?.split(
      ",",
    ) as UniRefund_TagService_Tags_RefundType[],
    travellerIds: searchParams.travellerIds?.split(","),
  };

  const tagsResponse = await getTagsApi(tagData);
  if (isErrorOnRequest(tagsResponse, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={tagsResponse.message}
      />
    );
  }

  const tagSummaryResponse = await getTagSummaryApi(tagData);
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
    <div className="flex h-full flex-col">
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
      <div className="grid grid-cols-10 gap-4 overflow-hidden">
        <div className="col-span-3 overflow-y-auto">
          <Filter languageData={languageData} />
        </div>
        <div className="col-span-7">
          <TaxFreeTagsTable
            languageData={languageData}
            response={tagsResponse.data}
          />
        </div>
      </div>
    </div>
  );
}
