"use server";

import {isUnauthorized} from "@repo/utils/policies";
import {isErrorOnRequest} from "@repo/utils/api";
import {getPermissionsApi} from "src/actions/core/AdministrationService/actions";
import {getUserDetailsByIdApi} from "src/actions/core/IdentityService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import {getResourceData} from "src/language-data/core/IdentityService";
import UserPermissions from "./_components/permissions";

export default async function Page({params}: {params: {lang: string; userId: string}}) {
  const {lang, userId} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["AbpIdentity.Users.ManagePermissions"],
    lang,
  });

  const userDetailsResponse = await getUserDetailsByIdApi(userId);
  if (isErrorOnRequest(userDetailsResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={userDetailsResponse.message} />;
  }

  const userPermissionsResponse = await getPermissionsApi({
    providerKey: userId,
    providerName: "U",
  });
  if (isErrorOnRequest(userPermissionsResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={userPermissionsResponse.message} />;
  }

  return (
    <>
      <UserPermissions languageData={languageData} userPermissionsData={userPermissionsResponse.data} />
      <div className="hidden" id="page-title">
        {`${languageData.User} (${userDetailsResponse.data.userName})`}
      </div>
      <div className="hidden" id="page-description">
        {languageData["User.Permissions.Description"]}
      </div>
    </>
  );
}
