"use server";
import { getRebateStatementHeadersByIdApi } from "src/actions/unirefund/FinanceService/actions";
import { getResourceData } from "src/language-data/unirefund/FinanceService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import RebateStatementInformation from "./_components/rebate-statement-information";

export default async function Page({
  params,
}: {
  params: { lang: string; rebateStatementId: string };
}) {
  const { lang, rebateStatementId } = params;
  await isUnauthorized({
    requiredPolicies: ["FinanceService.RebateStatementHeaders.View"],
    lang,
  });
  const rebateStatementHeadersResponse =
    await getRebateStatementHeadersByIdApi(rebateStatementId);
  if (isErrorOnRequest(rebateStatementHeadersResponse, lang)) return;
  const { languageData } = await getResourceData(lang);

  return (
    <RebateStatementInformation
      languageData={languageData}
      rebateStatementData={rebateStatementHeadersResponse.data}
    />
  );
}
