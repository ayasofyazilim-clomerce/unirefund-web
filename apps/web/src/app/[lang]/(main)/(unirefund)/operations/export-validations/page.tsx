"use server";

import type {GetApiExportValidationServiceExportValidationData} from "@ayasofyazilim/saas/ExportValidationService";
import {isUnauthorized} from "@repo/utils/policies";
import {isErrorOnRequest} from "@repo/utils/api";
import ErrorComponent from "@repo/ui/components/error-component";
import {getExportValidationApi} from "@repo/actions/unirefund/ExportValidationService/actions";
import {getResourceData} from "src/language-data/unirefund/ExportValidationService";
import ExportValidationTable from "./_components/table";

export default async function Page({
  params,
  searchParams,
}: {
  params: {lang: string};
  searchParams: GetApiExportValidationServiceExportValidationData;
}) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["ExportValidationService.ExportValidations"],
    lang,
  });
  const exportValidationResponse = await getExportValidationApi({
    ...searchParams,
    sorting: "exportDate desc",
  });
  if (isErrorOnRequest(exportValidationResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={exportValidationResponse.message} />;
  }

  return <ExportValidationTable languageData={languageData} response={exportValidationResponse.data} />;
}
