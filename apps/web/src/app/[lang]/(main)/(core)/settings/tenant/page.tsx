"use server";

import {getCountrySettingsApi} from "@repo/actions/unirefund/AdministrationService/actions";
import ErrorComponent from "@repo/ui/components/error-component";
import {structuredError} from "@repo/utils/api";
import {isRedirectError} from "next/dist/client/components/redirect";
import {getResourceData} from "@/language-data/core/AdministrationService";
import TenantSettingsPage from "@/app/[lang]/(main)/(core)/settings/tenant/group";

async function getApiRequests() {
  try {
    const requiredRequests = await Promise.all([getCountrySettingsApi()]);
    const optionalRequests = await Promise.allSettled([]);
    return {requiredRequests, optionalRequests};
  } catch (error) {
    if (!isRedirectError(error)) {
      return structuredError(error);
    }
    throw error;
  }
}

export default async function Page({params}: {params: {group: string; lang: string}}) {
  const {languageData} = await getResourceData(params.lang);
  const apiRequests = await getApiRequests();
  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message} />;
  }
  const [tenantSettingsResponse] = apiRequests.requiredRequests;

  return <TenantSettingsPage languageData={languageData} list={tenantSettingsResponse.data} />;
}
