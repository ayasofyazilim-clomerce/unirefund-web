"use server";

import type { GetApiCrmServiceCustomsData } from "@ayasofyazilim/saas/CRMService";
import { getCustomsApi } from "src/actions/unirefund/CrmService/actions";
import { getResourceData } from "src/language-data/unirefund/CRMService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import ErrorComponent from "../../../_components/error-component";
import CustomsTable from "./table";

interface SearchParamType {
  maxResultCount?: number;
  skipCount?: number;
  sorting?: string;
  name?: string;
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
    requiredPolicies: ["CRMService.Customs"],
    lang,
  });
  const { languageData } = await getResourceData(lang);
  const customResponse = await getCustomsApi({
    name: searchParams?.name || "",
    maxResultCount: searchParams?.maxResultCount || 10,
    skipCount: searchParams?.skipCount || 0,
  } as GetApiCrmServiceCustomsData);
  if (isErrorOnRequest(customResponse, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={customResponse.message}
      />
    );
  }
  return (
    <CustomsTable languageData={languageData} response={customResponse.data} />
  );
}
