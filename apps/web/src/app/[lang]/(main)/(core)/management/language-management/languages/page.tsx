"use server";

import type {GetApiLanguageManagementLanguagesData} from "@ayasofyazilim/saas/AdministrationService";
import {isUnauthorized} from "@repo/utils/policies";
import {getLanguagesApi} from "src/actions/core/AdministrationService/actions";
import {getResourceData} from "src/language-data/core/AdministrationService";
import {isErrorOnRequest} from "src/utils/page-policy/utils";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import LanguagesTable from "./_components/table";

export default async function Page({
  params,
  searchParams,
}: {
  params: {lang: string};
  searchParams: GetApiLanguageManagementLanguagesData;
}) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["LanguageManagement.Languages"],
    lang,
  });
  const languagesResponse = await getLanguagesApi(searchParams);
  if (isErrorOnRequest(languagesResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={languagesResponse.message} />;
  }

  return <LanguagesTable languageData={languageData} response={languagesResponse.data} />;
}
