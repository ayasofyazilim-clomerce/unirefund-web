"use server";

import {isUnauthorized} from "@repo/utils/policies";
import {isErrorOnRequest} from "@repo/utils/api";
import ErrorComponent from "@repo/ui/components/error-component";
import {getAllScopesApi} from "@repo/actions/core/IdentityService/actions";
import {getResourceData} from "src/language-data/core/IdentityService";
import Form from "./_components/form";

export default async function Page({params}: {params: {lang: string}}) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["OpenIddictPro.Scope.Create"],
    lang,
  });
  const scopesResponse = await getAllScopesApi();
  if (isErrorOnRequest(scopesResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={scopesResponse.message} />;
  }
  return (
    <>
      <Form languageData={languageData} scopeList={scopesResponse.data} />
      <div className="hidden" id="page-description">
        {languageData["Application.Create.Description"]}
      </div>
    </>
  );
}
