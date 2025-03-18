"use server";

import type {GetApiCrmServiceTaxFreesByIdSubTaxFreeData} from "@ayasofyazilim/saas/CRMService";
import {auth} from "@repo/utils/auth/next-auth";
import ErrorComponent from "@repo/ui/components/error-component";
import {getTaxFreeSubStoresByIdApi} from "@repo/actions/unirefund/CrmService/actions";
import {getResourceData} from "src/language-data/unirefund/CRMService";
import SubStoresTable from "./table";

async function getApiRequests(filters: GetApiCrmServiceTaxFreesByIdSubTaxFreeData) {
  try {
    const session = await auth();
    const apiRequests = await Promise.all([getTaxFreeSubStoresByIdApi(filters, session)]);
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
  const {lang, partyId} = params;
  const {languageData} = await getResourceData(lang);

  const apiRequests = await getApiRequests({
    id: partyId,
  });

  if (apiRequests.type === "error") {
    return <ErrorComponent languageData={languageData} message={apiRequests.message || "Unknown error occurred"} />;
  }

  const [subStoresResponse] = apiRequests.data;

  return <SubStoresTable languageData={languageData} response={subStoresResponse.data} />;
}
