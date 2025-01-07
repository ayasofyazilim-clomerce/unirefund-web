"use server";

import { getExportValidationDetailsApi } from "src/actions/unirefund/ExportValidationService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import { getResourceData } from "src/language-data/unirefund/ExportValidationService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import Form from "./_components/form";

export default async function Page({
  params,
}: {
  params: { lang: string; exportValidationId: string };
}) {
  const { lang, exportValidationId } = params;
  const { languageData } = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["ExportValidationService.ExportValidations.Edit"],
    lang,
  });
  const exportValidationDetailsResponse =
    await getExportValidationDetailsApi(exportValidationId);
  if (isErrorOnRequest(exportValidationDetailsResponse, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={exportValidationDetailsResponse.message}
      />
    );
  }
  return (
    <>
      <Form
        exportValidationData={exportValidationDetailsResponse.data}
        languageData={languageData}
      />
      <div className="hidden" id="page-title">
        {`${languageData.ExportValidation} (${exportValidationDetailsResponse.data.referenceId})`}
      </div>
      <div className="hidden" id="page-description">
        {languageData["ExportValidation.Update.Description"]}
      </div>
    </>
  );
}
