"use server";

import type { GetApiCrmServiceRefundPointsData } from "@ayasofyazilim/saas/CRMService";
import { getRefundPointsApi } from "src/actions/unirefund/CrmService/actions";
import { getResourceData } from "src/language-data/unirefund/CRMService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import ErrorComponent from "../../../_components/error-component";
import RefundPointsTable from "./table";

interface SearchParamType {
  maxResultCount?: number;
  skipCount?: number;
  sorting?: string;
  name?: string;
}

async function getApiRequests(filters: GetApiCrmServiceRefundPointsData) {
  try {
    const apiRequests = await Promise.all([getRefundPointsApi(filters)]);
    return {
      type: "success" as const,
      data: apiRequests,
    };
  } catch (error) {
    const err = error as { data?: string; message?: string };
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
  params: { lang: string };
  searchParams?: SearchParamType;
}) {
  const { lang } = params;
  await isUnauthorized({
    requiredPolicies: ["CRMService.RefundPoints"],
    lang,
  });
  const { languageData } = await getResourceData(lang);

  const apiRequests = await getApiRequests({
    name: searchParams?.name || "",
    maxResultCount: searchParams?.maxResultCount || 10,
    skipCount: searchParams?.skipCount || 0,
  } as GetApiCrmServiceRefundPointsData);

  if (apiRequests.type === "error") {
    return (
      <ErrorComponent
        languageData={languageData}
        message={apiRequests.message || "Unknown error occurred"}
      />
    );
  }

  const [refundPointResponse] = apiRequests.data;
  return (
    <RefundPointsTable
      languageData={languageData}
      response={refundPointResponse.data}
    />
  );
}
