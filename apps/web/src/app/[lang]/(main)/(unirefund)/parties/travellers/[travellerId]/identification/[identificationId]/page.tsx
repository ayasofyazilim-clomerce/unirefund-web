"use server";

import { getCountriesApi } from "src/actions/unirefund/LocationService/actions";
import { getTravellersDetailsApi } from "src/actions/unirefund/TravellerService/actions";
import { getResourceData } from "src/language-data/unirefund/TravellerService";
import { getBaseLink } from "src/utils";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import Form from "./form";

export default async function Page({
  params,
}: {
  params: { travellerId: string; lang: string; identificationId: string };
}) {
  const { lang, travellerId, identificationId } = params;
  await isUnauthorized({
    requiredPolicies: ["TravellerService.Travellers.Edit"],
    lang,
  });
  const { languageData } = await getResourceData(params.lang);
  const travellerDetailResponse = await getTravellersDetailsApi(travellerId);
  if (isErrorOnRequest(travellerDetailResponse, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={travellerDetailResponse.message}
      />
    );
  }

  const countriesResponse = await getCountriesApi();
  const countryList =
    (countriesResponse.type === "success" && countriesResponse.data.items) ||
    [];

  return (
    <>
      <Form
        countryList={countryList}
        identificationId={identificationId}
        languageData={languageData}
        travellerData={travellerDetailResponse.data}
        travellerId={travellerId}
      />
      <div className="hidden" id="page-title">
        {`${languageData["Travellers.Personal.Identification"]} (${travellerDetailResponse.data.personalIdentifications[0].travelDocumentNumber})`}
      </div>
      <div className="hidden" id="page-description">
        {languageData["Travellers.Identifications.Edit.Description"]}
      </div>
      <div className="hidden" id="page-back-link">
        {getBaseLink(`/parties/travellers/${travellerId}`)}
      </div>
    </>
  );
}
