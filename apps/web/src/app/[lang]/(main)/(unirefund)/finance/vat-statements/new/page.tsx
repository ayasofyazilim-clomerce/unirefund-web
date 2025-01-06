"use server";

import { getResourceData } from "src/language-data/unirefund/FinanceService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import VatStatementForm from "./_components/form";

export default async function Page({ params }: { params: { lang: string } }) {
  const { lang } = params;
  await isUnauthorized({
    requiredPolicies: ["FinanceService.VATStatementHeaders.Create"],
    lang,
  });
  const { languageData } = await getResourceData(lang);
  return (
    <>
      <VatStatementForm languageData={languageData} />
      <div className="hidden" id="page-description">
        {languageData["VATStatements.Create.Description"]}
      </div>
    </>
  );
}
