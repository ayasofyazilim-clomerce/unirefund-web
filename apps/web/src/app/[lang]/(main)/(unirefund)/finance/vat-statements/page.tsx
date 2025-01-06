"use server";

import type { GetApiFinanceServiceVatStatementHeadersData } from "@ayasofyazilim/saas/FinanceService";
import { getVatStatementHeadersApi } from "src/actions/unirefund/FinanceService/actions";
import { getResourceData } from "src/language-data/unirefund/FinanceService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import VatStatementTable from "./_components/table";

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
    requiredPolicies: ["FinanceService.VATStatementHeaders"],
    lang,
  });

  const vatStatementResponse = await getVatStatementHeadersApi(searchParams);
  if (isErrorOnRequest(vatStatementResponse, lang)) return;
  const { languageData } = await getResourceData(lang);

  return (
    <VatStatementTable
      languageData={languageData}
      locale={lang}
      response={vatStatementResponse.data}
    />
  );
}
