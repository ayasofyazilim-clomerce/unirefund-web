"use server";

import type { UniRefund_TravellerService_Travellers_TravellerDetailProfileDto } from "@ayasofyazilim/saas/TravellerService";
import { getCountriesApi } from "src/actions/unirefund/LocationService/actions";
import { getTravellersDetailsApi } from "src/actions/unirefund/TravellerService/actions";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { getResourceData } from "src/language-data/unirefund/TravellerService";
import { getBaseLink } from "src/utils";
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

  const traveller = await getTravellersDetailsApi(travellerId);
  const countries = await getCountriesApi();
  const travellerData =
    traveller.data as UniRefund_TravellerService_Travellers_TravellerDetailProfileDto;
  const countryList =
    (countries.type === "success" && countries.data.items) || [];

  const { languageData } = await getResourceData(params.lang);

  return (
    <>
      <Form
        countryList={{
          data: countryList,
          success: countries.type === "success",
        }}
        identificationId={identificationId}
        languageData={languageData}
        travellerData={travellerData}
        travellerId={travellerId}
      />
      <div className="hidden" id="page-title">
        {`${languageData["Travellers.Personal.Identification"]} (${travellerData.personalIdentifications[0].travelDocumentNumber})`}
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
