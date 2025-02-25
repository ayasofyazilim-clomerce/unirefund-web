"use server";

import type {GetApiCrmServiceRefundPointsData} from "@ayasofyazilim/saas/CRMService";
import {auth} from "@repo/utils/auth/next-auth";
import {isUnauthorized} from "@repo/utils/policies";
import ErrorComponent from "@repo/ui/components/error-component";
import {getRefundPointsApi} from "src/actions/unirefund/CrmService/actions";
import {getResourceData} from "src/language-data/unirefund/CRMService";
import RefundPointsTable from "./table";

interface SearchParamType {
  maxResultCount?: number;
  skipCount?: number;
  sorting?: string;
  name?: string;
  typeCode?: string;
}

async function getApiRequests(filters: GetApiCrmServiceRefundPointsData) {
  try {
    const session = await auth();
    const apiRequests = await Promise.all([getRefundPointsApi(filters, session)]);
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
export default async function Page({params, searchParams}: {params: {lang: string}; searchParams?: SearchParamType}) {
  const {lang} = params;
  await isUnauthorized({
    requiredPolicies: ["CRMService.RefundPoints"],
    lang,
  });
  const {languageData} = await getResourceData(lang);

  const apiRequests = await getApiRequests({
    typeCodes: searchParams?.typeCode?.split(",") || [],
    name: searchParams?.name || "",
    maxResultCount: searchParams?.maxResultCount || 10,
    skipCount: searchParams?.skipCount || 0,
  } as GetApiCrmServiceRefundPointsData);

  if (apiRequests.type === "error") {
    return <ErrorComponent languageData={languageData} message={apiRequests.message || "Unknown error occurred"} />;
  }

  const [refundPointResponse] = apiRequests.data;
  return <RefundPointsTable languageData={languageData} response={refundPointResponse.data} />;
}
