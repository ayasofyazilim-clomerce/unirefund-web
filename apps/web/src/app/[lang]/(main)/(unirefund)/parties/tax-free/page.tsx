"use server";

import type { GetApiCrmServiceTaxFreesData } from "@ayasofyazilim/saas/CRMService";
import { getTaxFreesApi } from "src/actions/unirefund/CrmService/actions";
import { getResourceData } from "src/language-data/unirefund/CRMService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import ErrorComponent from "../../../_components/error-component";
import TaxFreeTable from "./table";

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
    requiredPolicies: ["CRMService.TaxFrees"],
    lang,
  });
  const { languageData } = await getResourceData(lang);
  const taxFreeResponse = await getTaxFreesApi({
    name: searchParams?.name || "",
    maxResultCount: searchParams?.maxResultCount || 10,
    skipCount: searchParams?.skipCount || 0,
  } as GetApiCrmServiceTaxFreesData);

  if (isErrorOnRequest(taxFreeResponse, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={taxFreeResponse.message}
      />
    );
  }

  return (
    <TaxFreeTable languageData={languageData} response={taxFreeResponse.data} />
  );
}
