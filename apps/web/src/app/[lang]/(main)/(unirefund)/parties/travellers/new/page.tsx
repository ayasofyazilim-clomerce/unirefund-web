"use server";

import { getCountriesApi } from "src/actions/unirefund/LocationService/actions";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { getResourceData } from "src/language-data/unirefund/TravellerService";
import Form from "./form";

export default async function Page({ params }: { params: { lang: string } }) {
  await isUnauthorized({
    requiredPolicies: ["TravellerService.Travellers.Create"],
    lang: params.lang,
  });

  const { languageData } = await getResourceData(params.lang);
  const countries = await getCountriesApi();
  const countryList =
    (countries.type === "success" && countries.data.items) || [];

  return (
    <Form
      countryList={{
        data: countryList,
        success: countries.type === "success",
      }}
      languageData={languageData}
    />
  );
}
