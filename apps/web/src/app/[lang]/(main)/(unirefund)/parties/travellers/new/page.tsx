"use server";

import {getAllLanguagesApi} from "@repo/actions/core/AdministrationService/actions";
import {getAllCountriesApi} from "@repo/actions/unirefund/LocationService/actions";
import ErrorComponent from "@repo/ui/components/error-component";
import {auth} from "@repo/utils/auth/next-auth";
import {isUnauthorized} from "@repo/utils/policies";
import {getResourceData} from "src/language-data/unirefund/TravellerService";
import TravellerNewForm from "./form";

async function getApiRequests() {
  try {
    const session = await auth();
    const apiRequests = await Promise.all([getAllCountriesApi({}, session), getAllLanguagesApi(session)]);
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
export default async function Page({params}: {params: {lang: string}}) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["TravellerService.Travellers.Create"],
    lang,
  });

  const apiRequests = await getApiRequests();
  if (apiRequests.type === "error") {
    return <ErrorComponent languageData={languageData} message={apiRequests.message || "Unknown error occurred"} />;
  }
  const [countriesResponse, languagesResponse] = apiRequests.data;
  return (
    <TravellerNewForm
      countryList={countriesResponse.data.items || []}
      languageData={languageData}
      languagesList={(languagesResponse.data.items || []).map((language) => ({
        cultureName: language.cultureName ?? "",
        displayName: language.displayName ?? "",
      }))}
    />
  );
}
