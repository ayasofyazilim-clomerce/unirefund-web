"use server";

import { isUnauthorized } from "@repo/utils/policies";
import { getCountriesApi } from "src/actions/unirefund/LocationService/actions";
import { getTravellersDetailsApi } from "src/actions/unirefund/TravellerService/actions";
import { getResourceData } from "src/language-data/unirefund/TravellerService";
import { getBaseLink } from "src/utils";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import Form from "./form";

export default async function Page({
  params,
}: {
  params: { travellerId: string; lang: string };
}) {
  const { lang, travellerId } = params;
  await isUnauthorized({
    requiredPolicies: ["TravellerService.Travellers.Create"],
    lang,
  });
  const travellerDetailResponse = await getTravellersDetailsApi(travellerId);
  if (isErrorOnRequest(travellerDetailResponse, lang)) return;
  const countriesResponse = await getCountriesApi();
  if (isErrorOnRequest(countriesResponse, lang)) return;
  const { languageData } = await getResourceData(lang);

  return (
    <>
      <Form
        countryList={countriesResponse.data.items || []}
        languageData={languageData}
        travellerId={travellerId}
      />
      <div className="hidden" id="page-title">
        {`${languageData.Traveller} (${travellerDetailResponse.data.personalIdentifications[0].fullName})`}
      </div>
      <div className="hidden" id="page-description">
        {languageData["Travellers.Create.Identification.Description"]}
      </div>
      <div className="hidden" id="page-back-link">
        {getBaseLink(`/parties/travellers/${travellerId}`)}
      </div>
    </>
  );
}
