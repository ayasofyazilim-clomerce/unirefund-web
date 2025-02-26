"use server";

import {isUnauthorized} from "@repo/utils/policies";
import {isErrorOnRequest} from "@repo/utils/api";
import ErrorComponent from "@repo/ui/components/error-component";
import {
  getApplicationDetailsByIdApi,
  getApplicationsByIdTokenLifetimeApi,
} from "src/actions/core/IdentityService/actions";
import {getResourceData} from "src/language-data/core/IdentityService";
import Form from "./_components/form";

export default async function Page({params}: {params: {lang: string; applicationId: string}}) {
  const {lang, applicationId} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["OpenIddictPro.Application.Update"],
    lang,
  });

  const applicationDetailsResponse = await getApplicationDetailsByIdApi(applicationId);
  if (isErrorOnRequest(applicationDetailsResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={applicationDetailsResponse.message} />;
  }

  const lifeTokenResponse = await getApplicationsByIdTokenLifetimeApi(applicationId);
  if (isErrorOnRequest(lifeTokenResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={lifeTokenResponse.message} />;
  }

  return (
    <>
      <Form languageData={languageData} lifeTokenData={lifeTokenResponse.data} />
      <div className="hidden" id="page-title">
        {`${languageData.Application} (${applicationDetailsResponse.data.displayName})`}
      </div>
      <div className="hidden" id="page-description">
        {languageData["Application.LifeToken.Description"]}
      </div>
    </>
  );
}
