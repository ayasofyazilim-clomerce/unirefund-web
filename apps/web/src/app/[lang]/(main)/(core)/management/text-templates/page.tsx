"use server";

import type { GetApiTextTemplateManagementTemplateDefinitionsData } from "@ayasofyazilim/saas/AdministrationService";
import { isUnauthorized } from "@repo/utils/policies";
import { getTextTemplateApi } from "src/actions/core/AdministrationService/actions";
import { getResourceData } from "src/language-data/core/AdministrationService";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import ErrorComponent from "../../../_components/error-component";
import TextTemplateTable from "./_components/table";

export default async function Page({
  params,
  searchParams,
}: {
  params: { lang: string };
  searchParams: GetApiTextTemplateManagementTemplateDefinitionsData;
}) {
  const { lang } = params;
  const { languageData } = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["TextTemplateManagement.TextTemplates"],
    lang,
  });
  const textTemplateResponse = await getTextTemplateApi(searchParams);

  if (isErrorOnRequest(textTemplateResponse, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={textTemplateResponse.message}
      />
    );
  }

  return (
    <TextTemplateTable
      languageData={languageData}
      response={textTemplateResponse.data}
    />
  );
}
