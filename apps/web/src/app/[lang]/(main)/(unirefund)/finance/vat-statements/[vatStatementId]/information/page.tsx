"use server";
import { getVatStatementHeadersByIdApi } from "src/actions/unirefund/FinanceService/actions";
import { getResourceData } from "src/language-data/unirefund/FinanceService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import VatStatementInformation from "./_components/vat-statement-information";

export default async function Page({
  params,
}: {
  params: { lang: string; vatStatementId: string };
}) {
  const { lang, vatStatementId } = params;
  await isUnauthorized({
    requiredPolicies: ["FinanceService.VATStatementHeader"],
    lang,
  });
  const vatStatementHeadersResponse =
    await getVatStatementHeadersByIdApi(vatStatementId);
  if (isErrorOnRequest(vatStatementHeadersResponse, lang)) return;
  const { languageData } = await getResourceData(lang);

  return (
    <VatStatementInformation
      VatStatementData={vatStatementHeadersResponse.data}
      languageData={languageData}
    />
  );
}
