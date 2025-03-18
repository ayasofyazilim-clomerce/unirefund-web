"use server";

import {isUnauthorized} from "@repo/utils/policies";
import {isErrorOnRequest} from "@repo/utils/api";
import ErrorComponent from "@repo/ui/components/error-component";
import {getLanguageDetailsByIdApi} from "@repo/actions/core/AdministrationService/actions";
import {getResourceData} from "src/language-data/core/AdministrationService";
import Form from "./_components/form";

export default async function Page({params}: {params: {lang: string; languageId: string}}) {
  const {lang, languageId} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["LanguageManagement.Languages.Edit"],
    lang,
  });
  const languageDetailsResponse = await getLanguageDetailsByIdApi(languageId);
  if (isErrorOnRequest(languageDetailsResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={languageDetailsResponse.message} />;
  }
  return (
    <>
      <Form languageData={languageData} languageDetailsData={languageDetailsResponse.data} />
      <div className="hidden" id="page-title">
        {`${languageData.Language} (${languageDetailsResponse.data.displayName})`}
      </div>
      <div className="hidden" id="page-description">
        {languageData["Language.Update.Description"]}
      </div>
    </>
  );
}
