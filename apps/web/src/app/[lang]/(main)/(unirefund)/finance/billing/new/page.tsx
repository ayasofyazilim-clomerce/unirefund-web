"use server";

import { getMerchantsApi } from "src/actions/unirefund/CrmService/actions";
import { getResourceData as getFinanceResources } from "src/language-data/unirefund/FinanceService";
import { getResourceData as getCRMResources } from "src/language-data/unirefund/CRMService";
import Form from "./form";

export default async function Page({ params }: { params: { lang: string } }) {
  const { languageData: financeLanguageData } = await getFinanceResources(
    params.lang,
  );
  const { languageData: crmLanguageData } = await getCRMResources(params.lang);
  const merchant = await getMerchantsApi();
  const merchantsList =
    (merchant.type === "success" && merchant.data.items) || [];

  return (
    <>
      <Form
        languageData={{
          finance: financeLanguageData,
          crm: crmLanguageData,
        }}
        merchants={{
          data: merchantsList,
          success: merchant.type === "success",
        }}
      />
      <div className="hidden" id="page-title">
        {financeLanguageData["Billing.New"]}
      </div>
      <div className="hidden" id="page-description">
        {financeLanguageData["Billing.New.Description"]}
      </div>
    </>
  );
}
