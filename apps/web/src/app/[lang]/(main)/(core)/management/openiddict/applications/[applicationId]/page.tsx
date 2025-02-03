"use server";

import { isUnauthorized } from "@repo/utils/policies";
import {
  getAllScopesApi,
  getApplicationDetailsByIdApi,
} from "src/actions/core/IdentityService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import { getResourceData } from "src/language-data/core/IdentityService";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import Form from "./_components/form";

export default async function Page({
  params,
}: {
  params: { lang: string; applicationId: string };
}) {
  const { lang, applicationId } = params;
  const { languageData } = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["OpenIddictPro.Application.Update"],
    lang,
  });

  const applicationDetailsResponse =
    await getApplicationDetailsByIdApi(applicationId);
  if (isErrorOnRequest(applicationDetailsResponse, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={applicationDetailsResponse.message}
      />
    );
  }

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
      <Form
        applicationDetailsData={applicationDetailsResponse.data}
        languageData={languageData}
        scopeList={scopesResponse.data}
      />
      <div className="hidden" id="page-title">
        {`${languageData.Application} (${applicationDetailsResponse.data.displayName})`}
      </div>
      <div className="hidden" id="page-description">
        {languageData["Application.Update.Description"]}
      </div>
    </>
  );
}
