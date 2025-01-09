"use server";

import type { GetApiSaasTenantsData } from "@ayasofyazilim/saas/SaasService";
import {
  getTenantsApi,
  getTenantsLookupEditionsApi,
} from "src/actions/core/SaasService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import { getResourceData } from "src/language-data/core/SaasService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import TenantsTable from "./_components/table";

export default async function Page({
  params,
  searchParams,
}: {
  params: { lang: string };
  searchParams: GetApiSaasTenantsData;
}) {
  const { lang } = params;
  const { languageData } = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["Saas.Tenants"],
    lang,
  });
  const tenantsResponse = await getTenantsApi(searchParams);
  if (isErrorOnRequest(tenantsResponse, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={tenantsResponse.message}
      />
    );
  }
  const editionsResponse = await getTenantsLookupEditionsApi();
  if (isErrorOnRequest(editionsResponse, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={editionsResponse.message}
      />
    );
  }

  return (
    <TenantsTable
      editionList={editionsResponse.data}
      languageData={languageData}
      response={tenantsResponse.data}
    />
  );
}
