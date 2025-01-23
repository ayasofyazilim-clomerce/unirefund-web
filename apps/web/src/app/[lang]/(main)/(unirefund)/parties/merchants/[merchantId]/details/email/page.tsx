"use server";

import { getMerchantEmailByIdApi } from "src/actions/unirefund/CrmService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import { getResourceData } from "src/language-data/unirefund/CRMService";
import EmailForm from "./form";

async function getApiRequests({ merchantId }: { merchantId: string }) {
  try {
    const apiRequests = await Promise.all([
      getMerchantEmailByIdApi(merchantId),
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
export default async function Page({
  params,
}: {
  params: {
    merchantId: string;
    lang: string;
  };
}) {
  const { merchantId, lang } = params;
  const { languageData } = await getResourceData(lang);

  const apiRequests = await getApiRequests({ merchantId });
  if (apiRequests.type === "error") {
    return (
      <ErrorComponent
        languageData={languageData}
        message={apiRequests.message || "Unknown error occurred"}
      />
    );
  }

  const [emailResponse] = apiRequests.data;
  const emaildata = emailResponse.data;

  return (
    <EmailForm
      emailData={emaildata}
      languageData={languageData}
      merchantId={merchantId}
    />
  );
}
