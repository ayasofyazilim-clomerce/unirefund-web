"use server";

import type { GetApiTravellerServiceTravellersData } from "@ayasofyazilim/saas/TravellerService";
import { getResourceData } from "src/language-data/unirefund/TravellerService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import { getCountriesApi } from "../../../../../../actions/unirefund/LocationService/actions";
import { getTravellersApi } from "../../../../../../actions/unirefund/TravellerService/actions";
import ErrorComponent from "../../../_components/error-component";
import TravellersTable from "./table";

export default async function Page({
  params,
  searchParams,
}: {
  params: {
    lang: string;
  };
  searchParams: GetApiTravellerServiceTravellersData & {
    nationalities?: string;
    residences?: string;
  };
}) {
  const { lang } = params;
  await isUnauthorized({
    requiredPolicies: ["TravellerService.Travellers"],
    lang,
  });

  const { languageData } = await getResourceData(lang);

  const travellerResponse = await getTravellersApi({
    ...searchParams,
    nationalities: searchParams.nationalities?.split(",") || [],
    residences: searchParams.residences?.split(",") || [],
  });
  if (isErrorOnRequest(travellerResponse, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={travellerResponse.message}
      />
    );
  }

  const countriesResponse = await getCountriesApi();
  if (isErrorOnRequest(countriesResponse, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={countriesResponse.message}
      />
    );
  }

  return (
    <TravellersTable
      countryList={countriesResponse.data.items || []}
      languageData={languageData}
      response={travellerResponse.data}
    />
  );
}
