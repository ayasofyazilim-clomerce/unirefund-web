"use server";
import {isUnauthorized} from "@repo/utils/policies";
import {getRebateStatementHeadersByIdApi} from "src/actions/unirefund/FinanceService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import {getResourceData} from "src/language-data/unirefund/FinanceService";
import {isErrorOnRequest} from "src/utils/page-policy/utils";
import RebateStatementInformation from "./_components/rebate-statement-information";

export default async function Page({params}: {params: {lang: string; rebateStatementId: string}}) {
  const {lang, rebateStatementId} = params;
  const {languageData} = await getResourceData(lang);

  await isUnauthorized({
    requiredPolicies: ["FinanceService.RebateStatementHeaders.View"],
    lang,
  });
  const rebateStatementHeadersByIdResponse = await getRebateStatementHeadersByIdApi(rebateStatementId);
  if (isErrorOnRequest(rebateStatementHeadersByIdResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={rebateStatementHeadersByIdResponse.message} />;
  }

  return (
    <>
      <RebateStatementInformation
        languageData={languageData}
        rebateStatementData={rebateStatementHeadersByIdResponse.data}
      />
      <div className="hidden" id="page-description">
        {languageData["RebateStatement.Information.Description"]}
      </div>
    </>
  );
}
