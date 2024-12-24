"use server";

import type { GetApiTravellerServiceTravellersData } from "@ayasofyazilim/saas/TravellerService";
import { getResourceData } from "src/language-data/unirefund/TravellerService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import { getCountriesApi } from "../../../../../../actions/unirefund/LocationService/actions";
import { getTravellersApi } from "../../../../../../actions/unirefund/TravellerService/actions";
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

  const countries = await getCountriesApi();
  const countryList =
    (countries.type === "success" && countries.data.items) || [];
  const response = await getTravellersApi({
    ...searchParams,
    nationalities: searchParams.nationalities?.split(",") || [],
    residences: searchParams.residences?.split(",") || [],
  });
  if (isErrorOnRequest(response, lang)) return;

  const { languageData } = await getResourceData(lang);
  return (
    <TravellersTable
      countryList={countryList}
      languageData={languageData}
      response={response.data}
    />
  );
}
