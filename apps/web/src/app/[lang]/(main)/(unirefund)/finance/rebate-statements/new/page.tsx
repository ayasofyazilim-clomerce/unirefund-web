"use server";

import { getMerchantsApi } from "src/actions/unirefund/CrmService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import { getResourceData } from "src/language-data/unirefund/FinanceService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import RebateStatementForm from "./_components/form";

export default async function Page({ params }: { params: { lang: string } }) {
  const { lang } = params;
  await isUnauthorized({
    requiredPolicies: ["FinanceService.RebateStatementHeaders.Create"],
    lang,
  });
  const { languageData } = await getResourceData(lang);
  const merchantListResponse = await getMerchantsApi({
    typeCodes: ["HEADQUARTER"],
  });
  if (isErrorOnRequest(merchantListResponse, lang)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={merchantListResponse.message}
      />
    );
  }
  return (
    <>
      <RebateStatementForm
        languageData={languageData}
        merchantList={merchantListResponse.data.items || []}
      />
      <div className="hidden" id="page-description">
        {languageData["RebateStatement.Create.Description"]}
      </div>
    </>
  );
}
