"use server";

import {isUnauthorized} from "@repo/utils/policies";
import {isErrorOnRequest} from "@repo/utils/api";
import ErrorComponent from "@repo/ui/components/error-component";
import {getScopeDetailsByIdApi} from "@repo/actions/core/IdentityService/actions";
import {getResourceData} from "src/language-data/core/IdentityService";
import Form from "./_components/form";

export default async function Page({params}: {params: {lang: string; scopeId: string}}) {
  const {lang, scopeId} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["OpenIddictPro.Scope.Update"],
    lang,
  });

  const scopeDetailsResponse = await getScopeDetailsByIdApi(scopeId);
  if (isErrorOnRequest(scopeDetailsResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={scopeDetailsResponse.message} />;
  }

  return (
    <>
      <Form languageData={languageData} response={scopeDetailsResponse.data} />
      <div className="hidden" id="page-title">
        {`${languageData.Scope} (${scopeDetailsResponse.data.name})`}
      </div>
      <div className="hidden" id="page-description">
        {languageData["Scope.Update.Description"]}
      </div>
    </>
  );
}
