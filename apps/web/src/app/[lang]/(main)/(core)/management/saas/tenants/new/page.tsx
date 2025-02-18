"use server";

import {structuredError} from "@repo/utils/api";
import {auth} from "@repo/utils/auth/next-auth";
import {isUnauthorized} from "@repo/utils/policies";
import {getTimeZoneApi} from "@/actions/unirefund/SettingService/actions";
import {getAllCountriesApi, getCurrencyApi} from "@/actions/unirefund/LocationService/actions";
import {getAllLanguagesApi} from "src/actions/core/AdministrationService/actions";
import {getAllEditionsApi} from "src/actions/core/SaasService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import {getResourceData} from "src/language-data/core/SaasService";
import Form from "./_components/form";

async function getApiRequests() {
  try {
    const session = await auth();
    const requiredRequests = await Promise.all([
      getAllEditionsApi(session),
      getAllLanguagesApi(session),
      getAllCountriesApi({}, session),
      getCurrencyApi({}, session),
      getTimeZoneApi(session),
    ]);
    const optionalRequests = await Promise.allSettled([]);
    return {requiredRequests, optionalRequests};
  } catch (error) {
    return structuredError(error);
  }
}
export default async function Page({params}: {params: {lang: string}}) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["Saas.Tenants.Create"],
    lang,
  });

  const apiRequests = await getApiRequests();
  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message} />;
  }
  const {requiredRequests} = apiRequests;
  const [editionsResponse, languagesResponse, countriesResponse, currenciesResponse, timezonesResponse] =
    requiredRequests;

  return (
    <>
      <Form
        countryList={countriesResponse.data.items || []}
        currencyList={currenciesResponse.data.items || []}
        editionList={editionsResponse.data}
        languageData={languageData}
        languageList={languagesResponse.data.items || []}
        timezoneList={timezonesResponse.data}
      />
      <div className="hidden" id="page-description">
        {languageData["Tenant.Create.Description"]}
      </div>
    </>
  );
}
