"use server";

import type { GetApiCrmServiceIndividualsData } from "@ayasofyazilim/saas/CRMService";
import { notFound } from "next/navigation";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { getResourceData } from "src/language-data/unirefund/CRMService";
import { getIndividualsApi } from "src/actions/unirefund/CrmService/actions";
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

export default async function Page(props: {
  params: { lang: string };
  searchParams?: Promise<SearchParamType>;
}) {
  await isUnauthorized({
    requiredPolicies: ["CRMService.Merchants"],
    lang: props.params.lang,
  });

  const searchParams = await props.searchParams;
  const response = await getIndividualsApi({
    ...searchParams,
    typeCodes: searchParams?.typeCode?.split(",") || [],
  } as GetApiCrmServiceIndividualsData);

  if (response.type !== "success") return notFound();

  const { languageData } = await getResourceData(props.params.lang);
  return (
    <IndividualsTable languageData={languageData} response={response.data} />
  );
}
