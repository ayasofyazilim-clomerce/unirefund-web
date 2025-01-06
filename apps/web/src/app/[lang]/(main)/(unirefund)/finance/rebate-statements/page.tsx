"use server";

import type { GetApiFinanceServiceRebateStatementHeadersData } from "@ayasofyazilim/saas/FinanceService";
import { getRebateStatementHeadersApi } from "src/actions/unirefund/FinanceService/actions";
import { getResourceData } from "src/language-data/unirefund/FinanceService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
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
  await isUnauthorized({
    requiredPolicies: ["FinanceService.RebateStatementHeaders"],
    lang,
  });

  const response = await getRebateStatementHeadersApi(searchParams);
  const { languageData } = await getResourceData(lang);
  if (isErrorOnRequest(response, lang)) return;

  return (
    <RebateStatementTable
      languageData={languageData}
      locale={lang}
      response={response.data}
    />
  );
}
