"use server";

import { getResourceData } from "src/language-data/unirefund/FinanceService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { getMerchantsApi } from "src/actions/unirefund/CrmService/actions";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import VatStatementForm from "./_components/form";

export default async function Page({ params }: { params: { lang: string } }) {
  const { lang } = params;
  await isUnauthorized({
    requiredPolicies: ["FinanceService.VATStatementHeaders.Create"],
    lang,
  });
  const { languageData } = await getResourceData(lang);
  const merchantListResponse = await getMerchantsApi({
    typeCodes: ["HEADQUARTER"],
  });
  if (isErrorOnRequest(merchantListResponse, lang)) {
    return;
  }
  return (
    <>
      <VatStatementForm
        languageData={languageData}
        merchantList={merchantListResponse.data.items || []}
      />
      <div className="hidden" id="page-description">
        {languageData["VATStatement.Create.Description"]}
      </div>
    </>
  );
}
