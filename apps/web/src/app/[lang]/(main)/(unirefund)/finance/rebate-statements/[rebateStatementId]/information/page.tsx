"use server";
import {auth} from "@repo/utils/auth/next-auth";
import {isUnauthorized} from "@repo/utils/policies";
import ErrorComponent from "@repo/ui/components/error-component";
import {getRebateStatementHeadersByIdApi} from "@repo/actions/unirefund/FinanceService/actions";
import {getResourceData} from "src/language-data/unirefund/FinanceService";
import RebateStatementInformation from "./_components/rebate-statement-information";

async function getApiRequests(rebateStatementId: string) {
  try {
    const session = await auth();
    const apiRequests = await Promise.all([getRebateStatementHeadersByIdApi(rebateStatementId, session)]);
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

export default async function Page({params}: {params: {lang: string; rebateStatementId: string}}) {
  const {lang, rebateStatementId} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["FinanceService.RebateStatementHeaders.View"],
    lang,
  });

  const apiRequests = await getApiRequests(rebateStatementId);
  if (apiRequests.type === "error") {
    return <ErrorComponent languageData={languageData} message={apiRequests.message || "Unknown error occurred"} />;
  }
  const [rebateStatementHeadersByIdResponse] = apiRequests.data;

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
