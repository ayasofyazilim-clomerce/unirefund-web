"use server";

import { getAllScopesApi } from "src/actions/core/IdentityService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import { getResourceData } from "src/language-data/core/IdentityService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import Form from "./_components/form";

export default async function Page({ params }: { params: { lang: string } }) {
  const { lang } = params;
  const { languageData } = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["OpenIddictPro.Scope.Create"],
    lang,
  });
  const scopesResponse = await getAllScopesApi();
  if (isErrorOnRequest(scopesResponse, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={scopesResponse.message}
      />
    );
  }
  return (
    <>
      <Form languageData={languageData} scopeList={scopesResponse.data} />
      <div className="hidden" id="page-description">
        {languageData["Scope.Create.Description"]}
      </div>
    </>
  );
}
