"use server";

import type {GetApiFinanceServiceRebateStatementHeadersData} from "@repo/saas/FinanceService";
import {auth} from "@repo/utils/auth/next-auth";
import {isUnauthorized} from "@repo/utils/policies";
import ErrorComponent from "@repo/ui/components/error-component";
import {getRebateStatementHeadersApi} from "@repo/actions/unirefund/FinanceService/actions";
import {getResourceData} from "src/language-data/unirefund/FinanceService";
import RebateStatementTable from "./_components/table";

async function getApiRequests(searchParams: GetApiFinanceServiceRebateStatementHeadersData) {
  try {
    const session = await auth();
    const apiRequests = await Promise.all([getRebateStatementHeadersApi(searchParams, session)]);
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
  searchParams: GetApiFinanceServiceRebateStatementHeadersData;
}) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["FinanceService.RebateStatementHeaders"],
    lang,
  });

  const apiRequests = await getApiRequests(searchParams);
  if (apiRequests.type === "error") {
    return <ErrorComponent languageData={languageData} message={apiRequests.message || "Unknown error occurred"} />;
  }
  const [rebateStatementHeadersResponse] = apiRequests.data;

  return (
    <div className="my-6 rounded-lg border border-gray-200 p-2 md:p-6 ">
      <RebateStatementTable languageData={languageData} locale={lang} response={rebateStatementHeadersResponse.data} />
    </div>
  );
}
