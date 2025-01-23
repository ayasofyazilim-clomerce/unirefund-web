"use server";

import { getMerchantPhoneByIdApi } from "src/actions/unirefund/CrmService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import { getResourceData } from "src/language-data/unirefund/CRMService";
import TelephoneForm from "./form";

async function getApiRequests({ partyId }: { partyId: string }) {
  try {
    const apiRequests = await Promise.all([getMerchantPhoneByIdApi(partyId)]);
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
    partyId: string;
    lang: string;
  };
}) {
  const { partyId, lang } = params;
  const { languageData } = await getResourceData(lang);

  const apiRequests = await getApiRequests({ partyId });
  if (apiRequests.type === "error") {
    return (
      <ErrorComponent
        languageData={languageData}
        message={apiRequests.message || "Unknown error occurred"}
      />
    );
  }

  const [phoneResponse] = apiRequests.data;

  return (
    <TelephoneForm
      languageData={languageData}
      partyId={partyId}
      phoneResponse={phoneResponse.data}
    />
  );
}
