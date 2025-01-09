"use server";

import { getLanguagesCultureListApi } from "src/actions/core/AdministrationService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import { getResourceData } from "src/language-data/core/AdministrationService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import Form from "./_components/form";

export default async function Page({ params }: { params: { lang: string } }) {
  const { lang } = params;
  const { languageData } = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["LanguageManagement.Languages.Create"],
    lang,
  });
  const cultureResponse = await getLanguagesCultureListApi();
  if (isErrorOnRequest(cultureResponse, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={cultureResponse.message}
      />
    );
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
