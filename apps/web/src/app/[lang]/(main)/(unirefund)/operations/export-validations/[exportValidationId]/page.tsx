"use server";

import {isUnauthorized} from "@repo/utils/policies";
import {isErrorOnRequest} from "@repo/utils/api";
import ErrorComponent from "@repo/ui/components/error-component";
import {getExportValidationDetailsApi} from "@repo/actions/unirefund/ExportValidationService/actions";
import {getResourceData} from "src/language-data/unirefund/ExportValidationService";
import Form from "./_components/form";

export default async function Page({params}: {params: {lang: string; exportValidationId: string}}) {
  const {lang, exportValidationId} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["ExportValidationService.ExportValidations.Edit"],
    lang,
  });
  const exportValidationDetailsResponse = await getExportValidationDetailsApi(exportValidationId);
  if (isErrorOnRequest(exportValidationDetailsResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={exportValidationDetailsResponse.message} />;
  }
  return (
    <>
      <Form exportValidationData={exportValidationDetailsResponse.data} languageData={languageData} />
      <div className="hidden" id="page-title">
        {`${languageData.ExportValidation} (${exportValidationDetailsResponse.data.tagNumber})`}
      </div>
      <div className="hidden" id="page-description">
        {languageData["ExportValidation.Update.Description"]}
      </div>
    </>
  );
}
