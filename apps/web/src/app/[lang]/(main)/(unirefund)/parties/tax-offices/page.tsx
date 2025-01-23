"use server";

import type { GetApiCrmServiceTaxOfficesData } from "@ayasofyazilim/saas/CRMService";
import { getTaxOfficesApi } from "src/actions/unirefund/CrmService/actions";
import { getResourceData } from "src/language-data/unirefund/CRMService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import ErrorComponent from "../../../_components/error-component";
import TaxOfficesTable from "./table";

interface SearchParamType {
  maxResultCount?: number;
  skipCount?: number;
  sorting?: string;
  name?: string;
}
async function getApiRequests(filters: GetApiCrmServiceTaxOfficesData) {
  try {
    const apiRequests = await Promise.all([getTaxOfficesApi(filters)]);
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
    requiredPolicies: ["CRMService.TaxOffices"],
    lang,
  });
  const { languageData } = await getResourceData(lang);
  const apiRequests = await getApiRequests({
    name: searchParams?.name || "",
    maxResultCount: searchParams?.maxResultCount || 10,
    skipCount: searchParams?.skipCount || 0,
  });

  if (apiRequests.type === "error") {
    return (
      <ErrorComponent
        languageData={languageData}
        message={apiRequests.message || "Unknown error occurred"}
      />
    );
  }

  const [taxOfficeResponse] = apiRequests.data;

  return (
    <TaxOfficesTable
      languageData={languageData}
      response={taxOfficeResponse.data}
    />
  );
}
