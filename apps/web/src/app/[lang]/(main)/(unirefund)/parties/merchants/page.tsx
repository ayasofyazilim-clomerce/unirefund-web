"use server";

import type { GetApiCrmServiceMerchantsData } from "@ayasofyazilim/saas/CRMService";
import { getMerchantsApi } from "src/actions/unirefund/CrmService/actions";
import { getResourceData } from "src/language-data/unirefund/CRMService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import ErrorComponent from "../../../_components/error-component";
import MerchantsTable from "./table";

interface SearchParamType {
  ids?: string;
  name?: string;
  maxResultCount?: number;
  skipCount?: number;
  sorting?: string;
  typeCode?: string;
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
    requiredPolicies: ["CRMService.Merchants"],
    lang,
  });
  const { languageData } = await getResourceData(lang);
  const merchantResponse = await getMerchantsApi({
    typeCodes: searchParams?.typeCode?.split(",") || [],
    name: searchParams?.name || "",
    maxResultCount: searchParams?.maxResultCount || 10,
    skipCount: searchParams?.skipCount || 0,
  } as GetApiCrmServiceMerchantsData);

  if (isErrorOnRequest(merchantResponse, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={merchantResponse.message}
      />
    );
  }

  return (
    <MerchantsTable
      languageData={languageData}
      response={merchantResponse.data}
    />
  );
}
