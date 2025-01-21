"use server";

import {
  getApplicationDetailsByIdApi,
  getApplicationsByIdTokenLifetimeApi,
} from "src/actions/core/IdentityService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import { getResourceData } from "src/language-data/core/IdentityService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
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

  const lifeTokenResponse =
    await getApplicationsByIdTokenLifetimeApi(applicationId);
  if (isErrorOnRequest(lifeTokenResponse, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={lifeTokenResponse.message}
      />
    );
  }

  return (
    <>
      <Form
        languageData={languageData}
        lifeTokenData={lifeTokenResponse.data}
      />
      <div className="hidden" id="page-title">
        {`${languageData.Role} (${applicationDetailsResponse.data.displayName})`}
      </div>
      <div className="hidden" id="page-description">
        {languageData["Application.LifeToken.Description"]}
      </div>
    </>
  );
}