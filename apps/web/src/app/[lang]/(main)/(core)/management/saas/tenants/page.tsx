"use server";

import type {GetApiSaasTenantsData} from "@ayasofyazilim/core-saas/SaasService";
import {isUnauthorized} from "@repo/utils/policies";
import {isErrorOnRequest} from "@repo/utils/api";
import ErrorComponent from "@repo/ui/components/error-component";
import {getTenantsApi, getTenantsLookupEditionsApi} from "src/actions/core/SaasService/actions";
import {getResourceData} from "src/language-data/core/SaasService";
import TenantsTable from "./_components/table";

export default async function Page({
  params,
  searchParams,
}: {
  params: {lang: string};
  searchParams: GetApiSaasTenantsData;
}) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["Saas.Tenants"],
    lang,
  });
  const tenantsResponse = await getTenantsApi(searchParams);
  if (isErrorOnRequest(tenantsResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={tenantsResponse.message} />;
  }
  const editionsResponse = await getTenantsLookupEditionsApi();
  if (isErrorOnRequest(editionsResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={editionsResponse.message} />;
  }

  return (
    <TenantsTable editionList={editionsResponse.data} languageData={languageData} response={tenantsResponse.data} />
  );
}
