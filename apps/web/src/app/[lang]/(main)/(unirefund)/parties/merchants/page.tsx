"use server";

import type { GetApiCrmServiceMerchantsData } from "@ayasofyazilim/saas/CRMService";
import { notFound } from "next/navigation";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { getResourceData } from "src/language-data/unirefund/CRMService";
import { getMerchantsApi } from "src/actions/unirefund/CrmService/actions";
import MerchantsTable from "./table";

interface SearchParamType {
  ids?: string;
  name?: string;
  maxResultCount?: number;
  skipCount?: number;
  sorting?: string;
  typeCode?: string;
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
  const response = await getMerchantsApi({
    typeCodes: searchParams?.typeCode?.split(",") || [],
    name: searchParams?.name || "",
    maxResultCount: searchParams?.maxResultCount || 10,
    skipCount: searchParams?.skipCount || 0,
  } as GetApiCrmServiceMerchantsData);

  if (response.type !== "success") return notFound();

  const { languageData } = await getResourceData(props.params.lang);
  return (
    <MerchantsTable languageData={languageData} response={response.data} />
  );
}
