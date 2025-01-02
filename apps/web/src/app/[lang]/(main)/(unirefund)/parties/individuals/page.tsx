"use server";

import type { GetApiCrmServiceIndividualsData } from "@ayasofyazilim/saas/CRMService";
import { getIndividualsApi } from "src/actions/unirefund/CrmService/actions";
import { getResourceData } from "src/language-data/unirefund/CRMService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import ErrorComponent from "../../../_components/error-component";
import IndividualsTable from "./table";

interface SearchParamType {
  ids?: string;
  name?: string;
  maxResultCount?: number;
  skipCount?: number;
  sorting?: string;
  typeCode?: string;
  entityPartyTypeCode?: string;
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
  const individualResponse = await getIndividualsApi({
    ...searchParams,
    typeCodes: searchParams?.typeCode?.split(",") || [],
  } as GetApiCrmServiceIndividualsData);

  if (isErrorOnRequest(individualResponse, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={individualResponse.message}
      />
    );
  }

  return (
    <IndividualsTable
      languageData={languageData}
      response={individualResponse.data}
    />
  );
}
