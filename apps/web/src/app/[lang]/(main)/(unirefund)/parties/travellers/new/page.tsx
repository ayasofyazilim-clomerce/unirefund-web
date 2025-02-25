"use server";

import {auth} from "@repo/utils/auth/next-auth";
import {isUnauthorized} from "@repo/utils/policies";
import ErrorComponent from "@repo/ui/components/error-component";
import {getAllCountriesApi} from "src/actions/unirefund/LocationService/actions";
import {getResourceData} from "src/language-data/unirefund/TravellerService";
import TravellerNewForm from "./form";

async function getApiRequests() {
  try {
    const session = await auth();
    const apiRequests = await Promise.all([getAllCountriesApi({}, session)]);
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
  const [countriesResponse] = apiRequests.data;

  return (
    <>
      <TravellerNewForm countryList={countriesResponse.data.items || []} languageData={languageData} />;
      <div className="hidden" id="page-description">
        {languageData["Travellers.Create.Description"]}
      </div>
    </>
  );
}
