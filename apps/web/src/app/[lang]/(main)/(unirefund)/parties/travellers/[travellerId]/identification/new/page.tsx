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
  params: { travellerId: string; lang: string };
}) {
  await isUnauthorized({
    requiredPolicies: ["TravellerService.Travellers.Create"],
    lang: params.lang,
  });

  const { languageData } = await getResourceData(params.lang);
  const traveller = await getTravellersDetailsApi(params.travellerId);
  const countries = await getCountriesApi();
  const countryList =
    (countries.type === "success" && countries.data.items) || [];
  const travellerData =
    traveller.data as UniRefund_TravellerService_Travellers_TravellerDetailProfileDto;

  return (
    <>
      <Form
        countryList={{
          data: countryList,
          success: countries.type === "success",
        }}
        languageData={languageData}
        travellerId={params.travellerId}
      />
      <div className="hidden" id="page-title">
        {`${languageData.Traveller} (${travellerData.personalIdentifications[0].fullName})`}
      </div>
      <div className="hidden" id="page-description">
        {languageData["Travellers.Create.Identification.Description"]}
      </div>
      <div className="hidden" id="page-back-link">
        {getBaseLink(`/parties/travellers/${params.travellerId}`)}
      </div>
    </>
  );
}
