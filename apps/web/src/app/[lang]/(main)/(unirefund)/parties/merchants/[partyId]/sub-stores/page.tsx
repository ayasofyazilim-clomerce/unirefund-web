"use server";

import type {GetApiCrmServiceMerchantsByIdSubMerchantsData} from "@ayasofyazilim/saas/CRMService";
import {auth} from "@repo/utils/auth/next-auth";
import ErrorComponent from "@repo/ui/components/error-component";
import {getMerchantSubStoresByIdApi} from "src/actions/unirefund/CrmService/actions";
import {getResourceData} from "src/language-data/unirefund/CRMService";
import SubStoresTable from "./table";

interface SearchParamType {
  maxResultCount?: number;
  skipCount?: number;
}

async function getApiRequests(filters: GetApiCrmServiceMerchantsByIdSubMerchantsData) {
  try {
    const session = await auth();
    const apiRequests = await Promise.all([getMerchantSubStoresByIdApi(filters, session)]);
    return {
      type: "success" as const,
      data: apiRequests,
    };
  } catch (error) {
    const err = error as {data?: string; message?: string};
    return {
      type: "error" as const,
      message: err.message,
    };
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
    id: partyId,
    maxResultCount: searchParams?.maxResultCount || 10,
    skipCount: searchParams?.skipCount || 0,
  });

  if (apiRequests.type === "error") {
    return <ErrorComponent languageData={languageData} message={apiRequests.message || "Unknown error occurred"} />;
  }

  const [subStoresResponse] = apiRequests.data;

  return <SubStoresTable languageData={languageData} response={subStoresResponse.data} />;
}
