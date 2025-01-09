"use server";

import type { GetApiSaasEditionsData } from "@ayasofyazilim/saas/SaasService";
import { getEditionsApi } from "src/actions/core/SaasService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import { getResourceData } from "src/language-data/core/SaasService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import EditionsTable from "./_components/table";

export default async function Page({
  params,
  searchParams,
}: {
  params: { lang: string };
  searchParams: GetApiSaasEditionsData;
}) {
  const { lang } = params;
  const { languageData } = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["Saas.Editions"],
    lang,
  });
  const editionsResponse = await getEditionsApi(searchParams);
  if (isErrorOnRequest(editionsResponse, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={editionsResponse.message}
      />
    );
  }

  return (
    <EditionsTable
      languageData={languageData}
      response={editionsResponse.data}
    />
  );
}
