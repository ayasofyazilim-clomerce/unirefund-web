"use server";

import type { GetApiCrmServiceRefundPointsData } from "@ayasofyazilim/saas/CRMService";
import { notFound } from "next/navigation";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { getResourceData } from "src/language-data/unirefund/CRMService";
import { getRefundPointsApi } from "src/actions/unirefund/CrmService/actions";
import RefundPointsTable from "./table";

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
    requiredPolicies: ["CRMService.RefundPoints"],
    lang: props.params.lang,
  });

  const searchParams = await props.searchParams;
  const response = await getRefundPointsApi({
    name: searchParams?.name || "",
    maxResultCount: searchParams?.maxResultCount || 10,
    skipCount: searchParams?.skipCount || 0,
  } as GetApiCrmServiceRefundPointsData);

  if (response.type !== "success") return notFound();

  const { languageData } = await getResourceData(props.params.lang);
  return (
    <RefundPointsTable languageData={languageData} response={response.data} />
  );
}
