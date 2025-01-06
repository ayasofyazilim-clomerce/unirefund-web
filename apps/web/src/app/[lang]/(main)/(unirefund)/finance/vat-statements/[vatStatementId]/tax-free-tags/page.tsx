"use server";
import { getVatStatementHeadersByIdApi } from "src/actions/unirefund/FinanceService/actions";
import { getResourceData } from "src/language-data/unirefund/FinanceService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import TaxFreeTagTable from "./_components/table";

export default async function Page({
  params,
}: {
  params: { lang: string; vatStatementId: string };
}) {
  const { lang, vatStatementId } = params;
  const { languageData } = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["FinanceService.VATStatementHeaders.View"],
    lang,
  });
  const vatStatementHeadersByIdResponse =
    await getVatStatementHeadersByIdApi(vatStatementId);
  if (isErrorOnRequest(vatStatementHeadersByIdResponse, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={vatStatementHeadersByIdResponse.message}
      />
    );
  }

  return (
    <>
      <TaxFreeTagTable
        languageData={languageData}
        taxFreeTagsData={vatStatementHeadersByIdResponse.data}
      />
      <div className="hidden" id="page-description">
        {languageData["VatStatement.TaxFreeTags.Description"]}
      </div>
    </>
  );
}
