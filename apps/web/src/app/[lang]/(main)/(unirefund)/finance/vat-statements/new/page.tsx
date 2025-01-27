"use server";

import { auth } from "@repo/utils/auth/next-auth";
import { getMerchantsApi } from "src/actions/unirefund/CrmService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import { getResourceData } from "src/language-data/unirefund/FinanceService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import VatStatementForm from "./_components/form";

async function getApiRequests() {
  try {
    const session = await auth();
    const apiRequests = await Promise.all([
      getMerchantsApi(
        {
          typeCodes: ["HEADQUARTER"],
        },
        session,
      ),
    ]);
    return {
      type: "success" as const,
      data: apiRequests,
    };
  } catch (error) {
    const err = error as { data?: string; message?: string };
    return {
      type: "error" as const,
      message: err.message,
    };
  }
}

export default async function Page({ params }: { params: { lang: string } }) {
  const { lang } = params;
  await isUnauthorized({
    requiredPolicies: ["FinanceService.VATStatementHeaders.Create"],
    lang,
  });
  const { languageData } = await getResourceData(lang);
  const apiRequests = await getApiRequests();

  if (apiRequests.type === "error") {
    return (
      <ErrorComponent
        languageData={languageData}
        message={apiRequests.message || "Unknown error occurred"}
      />
    );
  }

  const [merchantListResponse] = apiRequests.data;
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
