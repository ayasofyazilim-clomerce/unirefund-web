"use server";

import {structuredError} from "@repo/utils/api";
import {auth} from "@repo/utils/auth/next-auth";
import {isUnauthorized} from "@repo/utils/policies";
import ErrorComponent from "@repo/ui/components/error-component";
import {getTimeZoneApi} from "@/actions/unirefund/SettingService/actions";
import {getAllCountriesApi, getCurrencyApi} from "@/actions/unirefund/LocationService/actions";
import {getAllLanguagesApi} from "src/actions/core/AdministrationService/actions";
import {getAllEditionsApi, getTenantDetailsByIdApi} from "src/actions/core/SaasService/actions";
import {getResourceData} from "src/language-data/core/SaasService";
import Form from "./_components/form";

async function getApiRequests(tenantId: string) {
  try {
    const session = await auth();
    const requiredRequests = await Promise.all([
      getAllEditionsApi(session),
      getAllLanguagesApi(session),
      getAllCountriesApi({}, session),
      getCurrencyApi({}, session),
      getTimeZoneApi(session),
      getTenantDetailsByIdApi(tenantId, session),
    ]);
    const optionalRequests = await Promise.allSettled([]);
    return {requiredRequests, optionalRequests};
  } catch (error) {
    return structuredError(error);
  }
}
export default async function Page({params}: {params: {lang: string; tenantId: string}}) {
  const {lang, tenantId} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["Saas.Tenants.Update"],
    lang,
  });

  const apiRequests = await getApiRequests(tenantId);
  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message} />;
  }
  const {requiredRequests} = apiRequests;
  const [
    editionsResponse,
    languagesResponse,
    countriesResponse,
    currenciesResponse,
    timezonesResponse,
    tenantDetailsDataResponse,
  ] = requiredRequests;

  return (
    <>
      <Form
        countryList={countriesResponse.data.items || []}
        currencyList={currenciesResponse.data.items || []}
        editionList={editionsResponse.data}
        languageData={languageData}
        languageList={languagesResponse.data.items || []}
        tenantDetailsData={tenantDetailsDataResponse.data}
        timezoneList={timezonesResponse.data}
      />
      <div className="hidden" id="page-title">
        {`${languageData.Tenant} (${tenantDetailsDataResponse.data.name})`}
      </div>
      <div className="hidden" id="page-description">
        {languageData["Tenant.Update.Description"]}
      </div>
    </>
  );
}
