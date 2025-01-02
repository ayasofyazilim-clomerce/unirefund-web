"use server";

import type { GetApiCrmServiceTaxOfficesData } from "@ayasofyazilim/saas/CRMService";
import { getTaxOfficesApi } from "src/actions/unirefund/CrmService/actions";
import { getResourceData } from "src/language-data/unirefund/CRMService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import ErrorComponent from "../../../_components/error-component";
import TaxOfficesTable from "./table";

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
    requiredPolicies: ["CRMService.TaxOffices"],
    lang,
  });

  const taxOfficeResponse = await getTaxOfficesApi({
    name: searchParams?.name || "",
    maxResultCount: searchParams?.maxResultCount || 10,
    skipCount: searchParams?.skipCount || 0,
  } as GetApiCrmServiceTaxOfficesData);

  const { languageData } = await getResourceData(lang);
  if (isErrorOnRequest(taxOfficeResponse, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={taxOfficeResponse.message}
      />
    );
  }
  return (
    <TaxOfficesTable
      languageData={languageData}
      response={taxOfficeResponse.data}
    />
  );
}
