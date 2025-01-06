"use server";
import { getVatStatementHeadersByIdApi } from "src/actions/unirefund/FinanceService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
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
      <VatStatementInformation
        VatStatementData={vatStatementHeadersByIdResponse.data}
        languageData={languageData}
      />
      <div className="hidden" id="page-description">
        {languageData["VatStatement.Information.Description"]}
      </div>
    </>
  );
}
