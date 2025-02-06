"use server";
import {auth} from "@repo/utils/auth/next-auth";
import {isUnauthorized} from "@repo/utils/policies";
import {getVatStatementHeadersByIdApi} from "src/actions/unirefund/FinanceService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import {getResourceData} from "src/language-data/unirefund/FinanceService";
import VatStatementInformation from "./_components/vat-statement-information";

async function getApiRequests(vatStatementId: string) {
  try {
    const session = await auth();
    const apiRequests = await Promise.all([getVatStatementHeadersByIdApi(vatStatementId, session)]);
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

export default async function Page({params}: {params: {lang: string; vatStatementId: string}}) {
  const {lang, vatStatementId} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["FinanceService.VATStatementHeaders.View"],
    lang,
  });

  const apiRequests = await getApiRequests(vatStatementId);
  if (apiRequests.type === "error") {
    return <ErrorComponent languageData={languageData} message={apiRequests.message || "Unknown error occurred"} />;
  }
  const [vatStatementHeadersByIdResponse] = apiRequests.data;

  return (
    <>
      <VatStatementInformation VatStatementData={vatStatementHeadersByIdResponse.data} languageData={languageData} />
      <div className="hidden" id="page-description">
        {languageData["VatStatement.Information.Description"]}
      </div>
    </>
  );
}
