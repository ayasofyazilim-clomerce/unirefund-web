"use server";

import type {UniRefund_CRMService_Enums_EntityPartyTypeCode} from "@ayasofyazilim/saas/CRMService";
import {auth} from "@repo/utils/auth/next-auth";
import {isUnauthorized} from "@repo/utils/policies";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import {getResourceData} from "src/language-data/unirefund/CRMService";
import {getAffiliationCodeApi} from "@/actions/unirefund/CrmService/actions";
import {getAllCountriesApi} from "../../../../../../../actions/unirefund/LocationService/actions";
import IndividualForm from "./_components/form";

async function getApiRequests(entityPartyTypeCode?: UniRefund_CRMService_Enums_EntityPartyTypeCode) {
  try {
    const session = await auth();
    const apiRequests = await Promise.all([
      getAllCountriesApi({}, session),
      entityPartyTypeCode ? getAffiliationCodeApi({entityPartyTypeCode, maxResultCount: 1000}, session) : null,
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
    lang: string;
  };
  searchParams: {entityPartyTypeCode?: UniRefund_CRMService_Enums_EntityPartyTypeCode; partyId?: string};
}) {
  const {lang} = params;
  const {entityPartyTypeCode, partyId} = searchParams;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["CRMService.Individuals.Create"],
    lang,
  });

  const apiRequests = await getApiRequests(entityPartyTypeCode);
  if (apiRequests.type === "error") {
    return <ErrorComponent languageData={languageData} message={apiRequests.message || "Unknown error occurred"} />;
  }

  const [countriesResponse, affiliationCodeResponse] = apiRequests.data;

  return (
    <>
      <IndividualForm
        affiliationCodeResponse={affiliationCodeResponse?.data.items || []}
        countryList={countriesResponse.data.items || []}
        entityPartyTypeCode={entityPartyTypeCode}
        languageData={languageData}
        partyId={partyId}
      />
      <div className="hidden" id="page-description">
        {languageData["Individual.New.Description"]}
      </div>
    </>
  );
}
