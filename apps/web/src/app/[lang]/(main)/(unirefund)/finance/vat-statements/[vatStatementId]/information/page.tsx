"use server";
import { getVatStatementHeadersDetailApi } from "src/actions/unirefund/FinanceService/actions";
import { getResourceData } from "src/language-data/unirefund/FinanceService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import VatStatementInformation from "./vat-statement-information";

export default async function Page({
  params,
}: {
  params: { lang: string; vatStatementId: string };
}) {
  await isUnauthorized({
    requiredPolicies: ["FinanceService.VATStatementHeader"],
    lang: params.lang,
  });
  const response = await getVatStatementHeadersDetailApi(params.vatStatementId);
  const { languageData } = await getResourceData(params.lang);
  if (isErrorOnRequest(response, params.lang)) return;

  return (
    <VatStatementInformation
      VatStatementData={response.data}
      languageData={languageData}
    />
  );
}
