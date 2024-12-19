"use server";

import { getMerchantsApi } from "src/actions/unirefund/CrmService/actions";
import { getResourceData } from "src/language-data/unirefund/FinanceService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import VatStatementForm from "../_components/form";

export default async function Page({ params }: { params: { lang: string } }) {
  const { lang } = params;
  await isUnauthorized({
    requiredPolicies: ["FinanceService.VATStatementHeader.Create"],
    lang,
  });
  const { languageData } = await getResourceData(lang);
  const merchantListResponse = await getMerchantsApi();
  if (isErrorOnRequest(merchantListResponse, lang)) return;
  return (
    <VatStatementForm
      languageData={languageData}
      merchantList={merchantListResponse.data.items || []}
    />
  );
}
