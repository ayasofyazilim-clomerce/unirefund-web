"use server";

import type { GetApiFinanceServiceVatStatementHeadersData } from "@ayasofyazilim/saas/FinanceService";
import { getVatStatementHeadersApi } from "src/actions/unirefund/FinanceService/actions";
import { getResourceData } from "src/language-data/unirefund/FinanceService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import VatStatementTable from "./table";

export default async function Page({
  params,
  searchParams,
}: {
  params: {
    lang: string;
  };
  searchParams: GetApiFinanceServiceVatStatementHeadersData;
}) {
  const { lang } = params;
  await isUnauthorized({
    requiredPolicies: [
      "FinanceService.Billings",
      "FinanceService.VATStatementHeader",
    ],
    lang,
  });

  const response = await getVatStatementHeadersApi(searchParams);
  const { languageData } = await getResourceData(lang);
  if (isErrorOnRequest(response, lang)) return;

  return (
    <VatStatementTable
      languageData={languageData}
      locale={lang}
      response={response.data}
    />
  );
}
