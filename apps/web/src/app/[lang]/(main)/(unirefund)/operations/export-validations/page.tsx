"use server";

import type { GetApiExportValidationServiceExportValidationData } from "@ayasofyazilim/saas/ExportValidationService";
import { getExportValidationApi } from "src/actions/unirefund/ExportValidationService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import { getResourceData } from "src/language-data/unirefund/ExportValidationService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import ExportValidationTable from "./_components/table";

export default async function Page({
  params,
  searchParams,
}: {
  params: { lang: string };
  searchParams: GetApiExportValidationServiceExportValidationData;
}) {
  const { lang } = params;
  const { languageData } = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["ExportValidationService.ExportValidations"],
    lang,
  });
  const exportValidationResponse = await getExportValidationApi(searchParams);
  if (isErrorOnRequest(exportValidationResponse, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={exportValidationResponse.message}
      />
    );
  }

  return (
    <ExportValidationTable
      languageData={languageData}
      response={exportValidationResponse.data}
    />
  );
}
