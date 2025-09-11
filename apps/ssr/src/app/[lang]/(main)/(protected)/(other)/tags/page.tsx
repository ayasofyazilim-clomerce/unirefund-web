"use server";

import {getTagsApi} from "@repo/actions/unirefund/TagService/actions";
import type {GetApiTagServiceTagData} from "@repo/saas/TagService";
import ErrorComponent from "@repo/ui/components/error-component";
import {structuredError} from "@repo/utils/api";
import {auth} from "@repo/utils/auth/next-auth";
import {isRedirectError} from "next/dist/client/components/redirect";
import {getResourceData} from "src/language-data/unirefund/SSRService";
import TagsPageClient from "./client";

interface SearchParamType {
  tagNumber?: string;
  invoiceNumber?: string;
  travellerFullName?: string;
  travellerDocumentNumber?: string;
  merchantIds?: string;
  statuses?: string;
  refundTypes?: string;
  issuedStartDate?: string;
  issuedEndDate?: string;
  exportStartDate?: string;
  exportEndDate?: string;
  paidStartDate?: string;
  paidEndDate?: string;
  maxResultCount?: number;
  skipCount?: number;
  sorting?: string;
}

async function getApiRequests(filters: GetApiTagServiceTagData) {
  try {
    const session = await auth();
    const requiredRequests = await Promise.all([getTagsApi(filters, session)]);
    const optionalRequests = await Promise.allSettled([]);
    return {requiredRequests, optionalRequests};
  } catch (error) {
    if (!isRedirectError(error)) {
      return structuredError(error);
    }
    throw error;
  }
}

export default async function TagsPage({
  params,
  searchParams,
}: {
  params: {
    lang: string;
  };
  searchParams?: SearchParamType;
}) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);

  const apiRequests = await getApiRequests({
    tagNumber: searchParams?.tagNumber || "",
    invoiceNumber: searchParams?.invoiceNumber || "",
    travellerFullName: searchParams?.travellerFullName || "",
    travellerDocumentNumber: searchParams?.travellerDocumentNumber || "",
    merchantIds: searchParams?.merchantIds?.split(",") || [],
    statuses: searchParams?.statuses?.split(",") || [],
    refundTypes: searchParams?.refundTypes?.split(",") || [],
    issuedStartDate: searchParams?.issuedStartDate || "",
    issuedEndDate: searchParams?.issuedEndDate || "",
    exportStartDate: searchParams?.exportStartDate || "",
    exportEndDate: searchParams?.exportEndDate || "",
    paidStartDate: searchParams?.paidStartDate || "",
    paidEndDate: searchParams?.paidEndDate || "",
    maxResultCount: searchParams?.maxResultCount || 10,
    skipCount: searchParams?.skipCount || 0,
    sorting: searchParams?.sorting || "",
  } as GetApiTagServiceTagData);

  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message} />;
  }

  const [tagsResponse] = apiRequests.requiredRequests;

  return (
    <div className="mt-6">
      <TagsPageClient languageData={languageData} tagsResponse={tagsResponse} />
    </div>
  );
}
