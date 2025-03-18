"use server";
import {auth} from "@repo/utils/auth/next-auth";
import {isUnauthorized} from "@repo/utils/policies";
import ErrorComponent from "@repo/ui/components/error-component";
import {getVatStatementHeadersByIdApi} from "@repo/actions/unirefund/FinanceService/actions";
import {getResourceData} from "src/language-data/unirefund/FinanceService";
import TaxFreeTagTable from "./_components/table";

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
      <TaxFreeTagTable languageData={languageData} taxFreeTagsData={vatStatementHeadersByIdResponse.data} />
      <div className="hidden" id="page-description">
        {languageData["VatStatement.TaxFreeTags.Description"]}
      </div>
    </>
  );
}
