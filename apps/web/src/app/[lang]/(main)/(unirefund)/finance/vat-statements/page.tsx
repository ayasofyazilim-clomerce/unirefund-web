"use server";

import type {GetApiFinanceServiceVatStatementHeadersData} from "@repo/saas/FinanceService";
import {auth} from "@repo/utils/auth/next-auth";
import {isUnauthorized} from "@repo/utils/policies";
import ErrorComponent from "@repo/ui/components/error-component";
import {getVatStatementHeadersApi} from "@repo/actions/unirefund/FinanceService/actions";
import {getResourceData} from "src/language-data/unirefund/FinanceService";
import VatStatementTable from "./_components/table";

async function getApiRequests(searchParams: GetApiFinanceServiceVatStatementHeadersData) {
  try {
    const session = await auth();
    const apiRequests = await Promise.all([getVatStatementHeadersApi(searchParams, session)]);
    return {
      type: "success" as const,
      data: apiRequests,
    };
  } catch (error) {
    const err = error as {data?: string; message?: string};
    return {
      type: "error" as const,
      message: err.message,
    };
  }
}

export default async function Page({
  params,
  searchParams,
}: {
  params: {
    lang: string;
  };
  searchParams: GetApiFinanceServiceVatStatementHeadersData;
}) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["FinanceService.VATStatementHeaders"],
    lang,
  });

  const apiRequests = await getApiRequests(searchParams);
  if (apiRequests.type === "error") {
    return <ErrorComponent languageData={languageData} message={apiRequests.message || "Unknown error occurred"} />;
  }
  const [vatStatementHeadersResponse] = apiRequests.data;

  return <VatStatementTable languageData={languageData} locale={lang} response={vatStatementHeadersResponse.data} />;
}
