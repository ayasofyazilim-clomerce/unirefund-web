"use server";

import type { GetApiLanguageManagementLanguageTextsData } from "@ayasofyazilim/saas/AdministrationService";
import { isUnauthorized } from "@repo/utils/policies";
import {
  getLanguagesApi,
  getLanguagesResourcesApi,
  getLanguageTextsApi,
} from "src/actions/core/AdministrationService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import { getResourceData } from "src/language-data/core/AdministrationService";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import LanguageTextsTable from "./_components/table";

export default async function Page({
  params,
  searchParams,
}: {
  params: { lang: string };
  searchParams: GetApiLanguageManagementLanguageTextsData;
}) {
  const { lang } = params;
  const { languageData } = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["LanguageManagement.LanguageTexts"],
    lang,
  });
  const languageTextsResponse = await getLanguageTextsApi({
    ...searchParams,
    baseCultureName: searchParams.baseCultureName || "en",
    targetCultureName: searchParams.targetCultureName || "tr",
  });
  if (isErrorOnRequest(languageTextsResponse, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={languageTextsResponse.message}
      />
    );
  }
  const languagesResponse = await getLanguagesApi({
    maxResultCount: 300,
  });
  if (isErrorOnRequest(languagesResponse, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={languagesResponse.message}
      />
    );
  }
  const languagesResourcesResponse = await getLanguagesResourcesApi();
  if (isErrorOnRequest(languagesResourcesResponse, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={languagesResourcesResponse.message}
      />
    );
  }
  return (
    <LanguageTextsTable
      languageData={languageData}
      languageList={languagesResponse.data.items || []}
      languagesResourcesData={languagesResourcesResponse.data}
      response={languageTextsResponse.data}
    />
  );
}
