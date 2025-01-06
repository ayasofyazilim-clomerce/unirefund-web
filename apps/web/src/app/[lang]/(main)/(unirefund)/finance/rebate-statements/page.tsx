"use server";

import type { GetApiFinanceServiceRebateStatementHeadersData } from "@ayasofyazilim/saas/FinanceService";
import { getRebateStatementHeadersApi } from "src/actions/unirefund/FinanceService/actions";
import { getResourceData } from "src/language-data/unirefund/FinanceService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import ErrorComponent from "../../../_components/error-component";
import RebateStatementTable from "./_components/table";

export default async function Page({
  params,
  searchParams,
}: {
  params: {
    lang: string;
  };
  searchParams: GetApiFinanceServiceRebateStatementHeadersData;
}) {
  const { lang } = params;
  const { languageData } = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["FinanceService.RebateStatementHeaders"],
    lang,
  });
  const rebateStatementHeadersResponse =
    await getRebateStatementHeadersApi(searchParams);

  if (isErrorOnRequest(rebateStatementHeadersResponse, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={rebateStatementHeadersResponse.message}
      />
    );
  }

  return (
    <RebateStatementTable
      languageData={languageData}
      locale={lang}
      response={rebateStatementHeadersResponse.data}
    />
  );
}
