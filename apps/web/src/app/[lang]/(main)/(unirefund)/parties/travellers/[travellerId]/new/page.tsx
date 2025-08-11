"use server";

import {getAllCountriesApi} from "@repo/actions/unirefund/LocationService/actions";
import ErrorComponent from "@repo/ui/components/error-component";
import {structuredError} from "@repo/utils/api";
import {auth} from "@repo/utils/auth/next-auth";
import {isUnauthorized} from "@repo/utils/policies";
import {isRedirectError} from "next/dist/client/components/redirect";
import {getResourceData} from "src/language-data/unirefund/TravellerService";
import Form from "./form";

async function getApiRequests() {
  try {
    const session = await auth();
    const requiredRequests = await Promise.all([getAllCountriesApi({}, session)]);
    const optionalRequests = await Promise.allSettled([]);
    return {requiredRequests, optionalRequests};
  } catch (error) {
    if (!isRedirectError(error)) {
      return structuredError(error);
    }
    throw error;
  }
}

export default async function Page({params}: {params: {travellerId: string; lang: string}}) {
  const {lang, travellerId} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["TravellerService.Travellers.Create"],
    lang,
  });

  const apiRequests = await getApiRequests();
  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message || "Unknown error occurred"} />;
  }
  const [countriesResponse] = apiRequests.requiredRequests;

  return (
    <Form countryList={countriesResponse.data.items || []} languageData={languageData} travellerId={travellerId} />
  );
}
