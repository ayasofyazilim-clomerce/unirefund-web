"use server";
import {getVatStatementHeadersByIdApi} from "@repo/actions/unirefund/FinanceService/actions";
import ErrorComponent from "@repo/ui/components/error-component";
import {structuredError} from "@repo/utils/api";
import {auth} from "@repo/utils/auth/next-auth";
import {isUnauthorized} from "@repo/utils/policies";
import {isRedirectError} from "next/dist/client/components/redirect";
import {getResourceData} from "src/language-data/unirefund/FinanceService";
import VatStatementInformation from "./_components/vat-statement-information";

async function getApiRequests(vatStatementId: string) {
  try {
    const session = await auth();
    const requiredRequests = await Promise.all([getVatStatementHeadersByIdApi(vatStatementId, session)]);
    const optionalRequests = await Promise.allSettled([]);
    return {requiredRequests, optionalRequests};
  } catch (error) {
    if (!isRedirectError(error)) {
      return structuredError(error);
    }
    throw error;
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

  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message} />;
  }
  const {requiredRequests} = apiRequests;
  const [vatStatementHeadersByIdResponse] = requiredRequests;

  return (
    <>
      <VatStatementInformation VatStatementData={vatStatementHeadersByIdResponse.data} languageData={languageData} />
      <div className="hidden" id="page-description">
        {languageData["VatStatement.Information.Description"]}
      </div>
    </>
  );
}
