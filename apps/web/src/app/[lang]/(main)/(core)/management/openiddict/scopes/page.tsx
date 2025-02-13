"use server";

import type {GetApiOpeniddictScopesData} from "@ayasofyazilim/core-saas/IdentityService";
import {isUnauthorized} from "@repo/utils/policies";
import {isErrorOnRequest} from "@repo/utils/api";
import {getScopesApi} from "src/actions/core/IdentityService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import {getResourceData} from "src/language-data/core/IdentityService";
import ScopesTable from "./_components/table";

export default async function Page({
  params,
  searchParams,
}: {
  params: {lang: string};
  searchParams: GetApiOpeniddictScopesData;
}) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["OpenIddictPro.Scope"],
    lang,
  });

  const scopesResponse = await getScopesApi(searchParams);
  if (isErrorOnRequest(scopesResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={scopesResponse.message} />;
  }

  return <ScopesTable languageData={languageData} response={scopesResponse.data} />;
}
