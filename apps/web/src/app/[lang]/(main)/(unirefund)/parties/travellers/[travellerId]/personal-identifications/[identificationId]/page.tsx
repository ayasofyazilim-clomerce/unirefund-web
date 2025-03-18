"use server";

import {auth} from "@repo/utils/auth/next-auth";
import {isUnauthorized} from "@repo/utils/policies";
import ErrorComponent from "@repo/ui/components/error-component";
import {getAllCountriesApi} from "@repo/actions/unirefund/LocationService/actions";
import {getTravellersDetailsApi} from "@repo/actions/unirefund/TravellerService/actions";
import {getResourceData} from "src/language-data/unirefund/TravellerService";
import {getBaseLink} from "src/utils";
import Form from "./form";

async function getApiRequests(travellerId: string) {
  try {
    const session = await auth();
    const apiRequests = await Promise.all([
      getTravellersDetailsApi(travellerId, session),
      getAllCountriesApi({}, session),
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

export default async function Page({params}: {params: {travellerId: string; lang: string; identificationId: string}}) {
  const {lang, travellerId, identificationId} = params;
  await isUnauthorized({
    requiredPolicies: ["TravellerService.Travellers.Edit"],
    lang,
  });
  const {languageData} = await getResourceData(params.lang);
  const apiRequests = await getApiRequests(travellerId);

  if (apiRequests.type === "error") {
    return <ErrorComponent languageData={languageData} message={apiRequests.message || "Unknown error occurred"} />;
  }

  const [travellerDataResponse, countriesResponse] = apiRequests.data;

  return (
    <>
      <Form
        countryList={countriesResponse.data.items || []}
        identificationId={identificationId}
        languageData={languageData}
        travellerData={travellerDataResponse.data}
        travellerId={travellerId}
      />
      <div className="hidden" id="page-title">
        {`${languageData["Travellers.Personal.Identification"]} (${travellerDataResponse.data.personalIdentifications[0].travelDocumentNumber})`}
      </div>
      <div className="hidden" id="page-description">
        {languageData["Travellers.Identifications.Edit.Description"]}
      </div>
      <div className="hidden" id="page-back-link">
        {getBaseLink(`/parties/travellers/${travellerId}/personal-identifications`, lang)}
      </div>
    </>
  );
}
