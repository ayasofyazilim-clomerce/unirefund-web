"use server";

import {isUnauthorized} from "@repo/utils/policies";
import {isErrorOnRequest} from "@repo/utils/api";
import ErrorComponent from "@repo/ui/components/error-component";
import {getPermissionsApi} from "@repo/actions/core/AdministrationService/actions";
import {getApplicationDetailsByIdApi} from "@repo/actions/core/IdentityService/actions";
import {getResourceData} from "src/language-data/core/IdentityService";
import ApplicationPermissions from "./_components/permissions";

export default async function Page({params}: {params: {lang: string; applicationId: string}}) {
  const {lang, applicationId} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["OpenIddictPro.Application.ManagePermissions"],
    lang,
  });

  const applicationDetailsResponse = await getApplicationDetailsByIdApi(applicationId);
  if (isErrorOnRequest(applicationDetailsResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={applicationDetailsResponse.message} />;
  }

  const applicationPermissionsResponse = await getPermissionsApi({
    providerKey: applicationDetailsResponse.data.clientId || "",
    providerName: "C",
  });
  if (isErrorOnRequest(applicationPermissionsResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={applicationPermissionsResponse.message} />;
  }

  return (
    <>
      <ApplicationPermissions
        applicationPermissionsData={applicationPermissionsResponse.data}
        languageData={languageData}
      />
      <div className="hidden" id="page-title">
        {`${languageData.Application} (${applicationDetailsResponse.data.displayName})`}
      </div>
      <div className="hidden" id="page-description">
        {languageData["Application.Permissions.Description"]}
      </div>
    </>
  );
}
