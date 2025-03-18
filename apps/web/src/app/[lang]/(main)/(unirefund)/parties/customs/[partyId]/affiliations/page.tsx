"use server";

import type {GetApiCrmServiceCustomsByIdAffiliationsData} from "@ayasofyazilim/saas/CRMService";
import {auth} from "@repo/utils/auth/next-auth";
import {isUnauthorized} from "@repo/utils/policies";
import ErrorComponent from "@repo/ui/components/error-component";
import {getAffiliationCodeApi, getCustomAffiliationByIdApi} from "@repo/actions/unirefund/CrmService/actions";
import {getResourceData} from "src/language-data/unirefund/CRMService";
import AffiliationsTable from "./table";

async function getApiRequests(filters: GetApiCrmServiceCustomsByIdAffiliationsData) {
  try {
    const session = await auth();
    const apiRequests = await Promise.all([
      getCustomAffiliationByIdApi(filters, session),
      getAffiliationCodeApi({entityPartyTypeCode: "CUSTOMS", maxResultCount: 1000}, session),
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
  searchParams,
}: {
  params: {
    partyId: string;
    lang: string;
  };
  searchParams?: GetApiCrmServiceCustomsByIdAffiliationsData;
}) {
  const {lang, partyId} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["CRMService.Customs.ViewAffiliationList"],
    lang,
  });

  const apiRequests = await getApiRequests({
    ...searchParams,
    id: partyId,
  });

  if (apiRequests.type === "error") {
    return <ErrorComponent languageData={languageData} message={apiRequests.message || "Unknown error occurred"} />;
  }

  const [subStoresResponse, affiliationCodesResponse] = apiRequests.data;

  return (
    <AffiliationsTable
      affiliationCodes={affiliationCodesResponse.data.items || []}
      languageData={languageData}
      locale={lang}
      partyId={partyId}
      response={subStoresResponse.data}
    />
  );
}
