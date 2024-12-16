"use server";
import { getBillingDetailApi } from "src/actions/unirefund/FinanceService/actions";
import { getResourceData as getFinanceResources } from "src/language-data/unirefund/FinanceService";
import { getResourceData as getCRMResources } from "src/language-data/unirefund/CRMService";
import { getMerchantsApi } from "src/actions/unirefund/CrmService/actions";
import Form from "./form";

export default async function Page({
  params,
}: {
  params: { lang: string; billingId: string };
}) {
  const { languageData: financeLanguageData } = await getFinanceResources(
    params.lang,
  );
  const billing = await getBillingDetailApi(params.billingId);
  const { languageData: crmLanguageData } = await getCRMResources(params.lang);
  const merchant = await getMerchantsApi();
  const merchantsList =
    (merchant.type === "success" && merchant.data.items) || [];

  if (billing.type !== "success") {
    return (
      <div className="error-message">
        {billing.type + billing.message ||
          financeLanguageData["Billing.Fetch.Fail"]}
      </div>
    );
  }

  const billingList = billing.data;

  return (
    <>
      <Form
        billingData={billingList}
        billingId={params.billingId}
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
        {financeLanguageData["Billing.Edit"]}
      </div>
      <div className="hidden" id="page-description">
        {financeLanguageData["Billing.Edit.Description"]}
      </div>
    </>
  );
}
