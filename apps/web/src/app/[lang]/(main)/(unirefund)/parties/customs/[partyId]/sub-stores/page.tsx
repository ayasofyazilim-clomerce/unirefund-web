"use server";

import {getCustomsApi} from "@repo/actions/unirefund/CrmService/actions";
import ErrorComponent from "@repo/ui/components/error-component";
import {structuredError} from "@repo/utils/api";
import {auth} from "@repo/utils/auth/next-auth";
import {isRedirectError} from "next/dist/client/components/redirect";
import type {GetApiCrmServiceCustomsData} from "@repo/saas/CRMService";
import {getResourceData} from "src/language-data/unirefund/CRMService";
import SubStoresTable from "../../_components/table";

interface SearchParamType {
  maxResultCount?: number;
  skipCount?: number;
}

async function getApiRequests(filters: GetApiCrmServiceCustomsData) {
  try {
    const session = await auth();
    const requiredRequests = await Promise.all([getCustomsApi(filters, session)]);
    const optionalRequests = await Promise.allSettled([]);
    return {requiredRequests, optionalRequests};
  } catch (error) {
    if (!isRedirectError(error)) {
      return structuredError(error);
    }
    throw error;
  }
}
export default async function Page({
  params,
  searchParams,
}: {
  params: {
    partyId: string;
    lang: string;
  };
  searchParams?: SearchParamType;
}) {
  const {lang, partyId} = params;
  const {languageData} = await getResourceData(lang);

  const apiRequests = await getApiRequests({
    parentId: partyId,
    maxResultCount: searchParams?.maxResultCount || 10,
    skipCount: searchParams?.skipCount || 0,
  });
  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message} />;
  }

  const [subStoresResponse] = apiRequests.requiredRequests;

  return <SubStoresTable customs={subStoresResponse.data} languageData={languageData} newLink="sub-stores/new" />;
}
