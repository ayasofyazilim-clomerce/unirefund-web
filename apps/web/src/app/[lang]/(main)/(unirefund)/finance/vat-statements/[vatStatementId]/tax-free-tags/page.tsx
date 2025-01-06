"use server";
import { getVatStatementHeadersByIdApi } from "src/actions/unirefund/FinanceService/actions";
import { getResourceData } from "src/language-data/unirefund/FinanceService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import TaxFreeTagTable from "./_components/table";

export default async function Page({
  params,
}: {
  params: { lang: string; vatStatementId: string };
}) {
  const { lang, vatStatementId } = params;
  await isUnauthorized({
    requiredPolicies: ["FinanceService.VATStatementHeaders.View"],
    lang,
  });
  const vatStatementHeadersResponse =
    await getVatStatementHeadersByIdApi(vatStatementId);
  if (isErrorOnRequest(vatStatementHeadersResponse, lang)) return;
  const { languageData } = await getResourceData(lang);

  return (
    <>
      <TaxFreeTagTable
        languageData={languageData}
        taxFreeTagsData={vatStatementHeadersResponse.data}
      />
      <div className="hidden" id="page-description">
        {languageData["VatStatement.TaxFreeTags.Description"]}
      </div>
    </>
  );
}
