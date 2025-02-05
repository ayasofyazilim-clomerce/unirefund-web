"use server";

import {isUnauthorized} from "@repo/utils/policies";
import {getCountriesApi} from "src/actions/unirefund/LocationService/actions";
import {getResourceData} from "src/language-data/unirefund/TravellerService";
import {isErrorOnRequest} from "src/utils/page-policy/utils";
import Form from "./form";

export default async function Page({params}: {params: {lang: string}}) {
  const {lang} = params;
  await isUnauthorized({
    requiredPolicies: ["TravellerService.Travellers.Create"],
    lang,
  });
  const countriesResponse = await getCountriesApi();
  if (isErrorOnRequest(countriesResponse, lang)) return;
  const {languageData} = await getResourceData(lang);

  return <Form countryList={countriesResponse.data.items || []} languageData={languageData} />;
}
