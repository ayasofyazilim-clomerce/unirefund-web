"use server";

import type { GetApiCrmServiceTaxOfficesData } from "@ayasofyazilim/saas/CRMService";
import { notFound } from "next/navigation";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { getResourceData } from "src/language-data/unirefund/CRMService";
import { getTaxOfficesApi } from "src/actions/unirefund/CrmService/actions";
import TaxOfficesTable from "./table";

interface SearchParamType {
  maxResultCount?: number;
  skipCount?: number;
  sorting?: string;
  name?: string;
}

export default async function Page(props: {
  params: { lang: string };
  searchParams?: Promise<SearchParamType>;
}) {
  await isUnauthorized({
    requiredPolicies: ["CRMService.TaxOffices"],
    lang: props.params.lang,
  });

  const searchParams = await props.searchParams;
  const response = await getTaxOfficesApi({
    name: searchParams?.name || "",
    maxResultCount: searchParams?.maxResultCount || 10,
    skipCount: searchParams?.skipCount || 0,
  } as GetApiCrmServiceTaxOfficesData);

  if (response.type !== "success") return notFound();

  const { languageData } = await getResourceData(props.params.lang);
  return (
    <TaxOfficesTable languageData={languageData} response={response.data} />
  );
}
