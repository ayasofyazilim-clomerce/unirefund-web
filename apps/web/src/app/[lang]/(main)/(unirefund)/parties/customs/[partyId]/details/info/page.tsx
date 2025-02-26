"use server";

import {auth} from "@repo/utils/auth/next-auth";
import ErrorComponent from "@repo/ui/components/error-component";
import {getCustomByIdApi, getCustomsApi, getTaxOfficesApi} from "src/actions/unirefund/CrmService/actions";
import {getResourceData} from "src/language-data/unirefund/CRMService";
import CustomForm from "./form";

async function getApiRequests({partyId}: {partyId: string}) {
  try {
    const session = await auth();
    const apiRequests = await Promise.all([
      getCustomsApi({}, session),
      getCustomByIdApi(partyId, session),
      getTaxOfficesApi({}, session),
    ]);
    return {
      type: "success" as const,
      data: apiRequests,
    };
  } catch (error) {
    const err = error as {data?: string; message?: string};
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
  const {partyId, lang} = params;
  const {languageData} = await getResourceData(lang);

  const apiRequests = await getApiRequests({partyId});
  if (apiRequests.type === "error") {
    return <ErrorComponent languageData={languageData} message={apiRequests.message || "Unknown error occurred"} />;
  }

  const [customsResponse, customDetailResponse, taxOfficesResponse] = apiRequests.data;
  const customs = customsResponse.data;
  const customDetail = customDetailResponse.data;
  const taxOffices = taxOfficesResponse.data;

  const customList = customs.items?.filter((custom) => custom.id !== partyId) || [];

  return (
    <CustomForm
      customDetail={customDetail}
      customList={customList}
      languageData={languageData}
      partyId={partyId}
      taxOfficeList={taxOffices.items || []}
    />
  );
}
