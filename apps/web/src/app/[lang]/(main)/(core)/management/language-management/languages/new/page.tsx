"use server";

import {isUnauthorized} from "@repo/utils/policies";
import {isErrorOnRequest} from "@repo/utils/api";
import ErrorComponent from "@repo/ui/components/error-component";
import {getLanguagesCultureListApi} from "@repo/actions/core/AdministrationService/actions";
import {getResourceData} from "src/language-data/core/AdministrationService";
import Form from "./_components/form";

export default async function Page({params}: {params: {lang: string}}) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["LanguageManagement.Languages.Create"],
    lang,
  });
  const cultureResponse = await getLanguagesCultureListApi();
  if (isErrorOnRequest(cultureResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={cultureResponse.message} />;
  }
  return (
    <>
      <Form cultureList={cultureResponse.data} languageData={languageData} />
      <div className="hidden" id="page-description">
        {languageData["Language.Create.Description"]}
      </div>
    </>
  );
}
