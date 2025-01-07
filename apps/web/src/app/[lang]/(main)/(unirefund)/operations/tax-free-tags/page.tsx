"use server";

import type {
  GetApiTagServiceTagData,
  UniRefund_TagService_Tags_Enums_RefundType,
  UniRefund_TagService_Tags_TagStatusType,
} from "@ayasofyazilim/saas/TagService";
import type { FilterComponentSearchItem } from "@repo/ayasofyazilim-ui/molecules/filter-component";
import { CreditCard, DollarSign, Tags } from "lucide-react";
import {
  getTagsApi,
  getTagSummaryApi,
} from "src/actions/unirefund/TagService/actions";
import { getResourceData } from "src/language-data/unirefund/TagService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import { getDateRanges } from "src/utils/utils-date";
import { localizeCurrency } from "src/utils/utils-number";
import ErrorComponent from "../../../_components/error-component";
import { TagSummary } from "../_components/tag-summary";
import Filter from "./_components/filter";
import TaxFreeTagsTable from "./_components/table";
import TaxFreeTagsSearchForm from "./_components/tax-free-tags-search-form";

interface SearchParamType {
  maxResultCount?: number;
  skipCount?: number;
  sorting?: string;
  invoiceNumber?: string;
  exportDate?: string;
  issuedDate?: string;
  paidDate?: string;
  merchantIds?: string;
  refundTypes?: string;
  statuses?: string;
  tagNumber?: string;
  travellerDocumentNumber?: string;
  travellerFullName?: string;
  travellerIds?: string;
}

function initParams(searchParams: SearchParamType) {
  const { ranges } = getDateRanges();
  const {
    merchantIds: spMerchantIds,
    statuses: spStatuses,
    refundTypes: spRefundTypes,
    travellerIds: spTravellerIds,
    exportDate: spExportDate,
    issuedDate: spIssuedDate,
    paidDate: spPaidDate,
  } = searchParams;

  const merchantIdsParsed = JSON.parse(
    spMerchantIds || "[]",
  ) as FilterComponentSearchItem[];
  const merchantIds = merchantIdsParsed.map(
    (i: FilterComponentSearchItem) => i.id,
  );

  const tagData: GetApiTagServiceTagData = {
    ...searchParams,
    merchantIds,
    statuses: spStatuses?.split(
      ",",
    ) as UniRefund_TagService_Tags_TagStatusType[],
    refundTypes: spRefundTypes?.split(
      ",",
    ) as UniRefund_TagService_Tags_Enums_RefundType[],
    travellerIds: spTravellerIds?.split(","),
  };

  if (spIssuedDate) {
    tagData.issuedStartDate = ranges[spIssuedDate].startDate.toISOString();
    tagData.issuedEndDate = ranges[spIssuedDate].endDate.toISOString();
  }
  if (spPaidDate) {
    tagData.paidStartDate = ranges[spPaidDate].startDate.toISOString();
    tagData.paidEndDate = ranges[spPaidDate].endDate.toISOString();
  }
  if (spExportDate) {
    tagData.exportStartDate = ranges[spExportDate].startDate.toISOString();
    tagData.exportEndDate = ranges[spExportDate].endDate.toISOString();
  }
  return tagData;
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

  const tagData = initParams(searchParams);
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
      <div className="grid grid-cols-12 gap-4 overflow-hidden">
        <div className="col-span-4 overflow-y-auto">
          <Filter languageData={languageData} />
        </div>
        <div className="col-span-8 flex flex-col gap-3">
          <TaxFreeTagsSearchForm languageData={languageData} />
          <TaxFreeTagsTable
            languageData={languageData}
            response={tagsResponse.data}
          />
        </div>
      </div>
    </div>
  );
}
