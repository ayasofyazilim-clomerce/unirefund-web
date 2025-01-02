"use server";

import type { GetApiCrmServiceRefundPointsData } from "@ayasofyazilim/saas/CRMService";
import { getRefundPointsApi } from "src/actions/unirefund/CrmService/actions";
import { getResourceData } from "src/language-data/unirefund/CRMService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import ErrorComponent from "../../../_components/error-component";
import RefundPointsTable from "./table";

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
    requiredPolicies: ["CRMService.RefundPoints"],
    lang,
  });
  const { languageData } = await getResourceData(lang);
  const refundPointResponse = await getRefundPointsApi({
    name: searchParams?.name || "",
    maxResultCount: searchParams?.maxResultCount || 10,
    skipCount: searchParams?.skipCount || 0,
  } as GetApiCrmServiceRefundPointsData);

  if (isErrorOnRequest(refundPointResponse, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={refundPointResponse.message}
      />
    );
  }

  return (
    <RefundPointsTable
      languageData={languageData}
      response={refundPointResponse.data}
    />
  );
}
