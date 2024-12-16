"use server";

import type { GetApiCrmServiceCustomsData } from "@ayasofyazilim/saas/CRMService";
import { notFound } from "next/navigation";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { getResourceData } from "src/language-data/unirefund/CRMService";
import { getCustomsApi } from "src/actions/unirefund/CrmService/actions";
import CustomsTable from "./table";

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
    requiredPolicies: ["CRMService.Customs"],
    lang: props.params.lang,
  });

  const searchParams = await props.searchParams;
  const response = await getCustomsApi({
    name: searchParams?.name || "",
    maxResultCount: searchParams?.maxResultCount || 10,
    skipCount: searchParams?.skipCount || 0,
  } as GetApiCrmServiceCustomsData);

  if (response.type !== "success") return notFound();

  const { languageData } = await getResourceData(props.params.lang);
  return <CustomsTable languageData={languageData} response={response.data} />;
}
