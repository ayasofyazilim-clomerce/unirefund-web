"use server";

import type {GetApiCrmServiceCustomsData} from "@ayasofyazilim/saas/CRMService";
import {auth} from "@repo/utils/auth/next-auth";
import {isUnauthorized} from "@repo/utils/policies";
import ErrorComponent from "@repo/ui/components/error-component";
import {getCustomsApi} from "src/actions/unirefund/CrmService/actions";
import {getResourceData} from "src/language-data/unirefund/CRMService";
import CustomsTable from "./table";

interface SearchParamType {
  maxResultCount?: number;
  skipCount?: number;
  sorting?: string;
  name?: string;
}

async function getApiRequests(filter: GetApiCrmServiceCustomsData) {
  try {
    const session = await auth();
    const apiRequests = await Promise.all([getCustomsApi(filter, session)]);
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
    requiredPolicies: ["CRMService.Customs"],
    lang,
  });
  const {languageData} = await getResourceData(lang);
  const apiRequests = await getApiRequests({
    name: searchParams?.name || "",
    maxResultCount: searchParams?.maxResultCount || 10,
    skipCount: searchParams?.skipCount || 0,
  } as GetApiCrmServiceCustomsData);
  if (apiRequests.type === "error") {
    return <ErrorComponent languageData={languageData} message={apiRequests.message || "Unknown error occurred"} />;
  }
  const [customsResponse] = apiRequests.data;

  return <CustomsTable languageData={languageData} response={customsResponse.data} />;
}
