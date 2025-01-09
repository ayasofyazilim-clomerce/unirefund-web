"use server";

import { getCustomsApi } from "src/actions/unirefund/CrmService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import { getResourceData } from "src/language-data/unirefund/ExportValidationService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import Form from "./_components/form";

export default async function Page({ params }: { params: { lang: string } }) {
  const { lang } = params;
  const { languageData } = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["ExportValidationService.ExportValidations.Create"],
    lang,
  });

  const customsResponse = await getCustomsApi();
  if (isErrorOnRequest(customsResponse, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={customsResponse.message}
      />
    );
  }

  return (
    <>
      <Form
        customList={customsResponse.data.items || []}
        languageData={languageData}
      />
      <div className="hidden" id="page-description">
        {languageData["ExportValidation.Create.Description"]}
      </div>
    </>
  );
}
