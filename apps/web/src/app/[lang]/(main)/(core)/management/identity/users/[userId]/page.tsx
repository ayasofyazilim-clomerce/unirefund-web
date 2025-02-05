"use server";

import {isUnauthorized} from "@repo/utils/policies";
import {
  getAllRolesApi,
  getUserDetailsByIdApi,
  getUsersAvailableOrganizationUnitsApi,
  getUsersByIdOrganizationUnitsApi,
  getUsersByIdRolesApi,
} from "src/actions/core/IdentityService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import {getResourceData} from "src/language-data/core/IdentityService";
import {isErrorOnRequest} from "src/utils/page-policy/utils";
import Form from "./_components/form";

export default async function Page({params}: {params: {lang: string; userId: string}}) {
  const {lang, userId} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["AbpIdentity.Users.Update"],
    lang,
  });

  const userDetailsResponse = await getUserDetailsByIdApi(userId);
  if (isErrorOnRequest(userDetailsResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={userDetailsResponse.message} />;
  }

  const rolesResponse = await getAllRolesApi();
  if (isErrorOnRequest(rolesResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={rolesResponse.message} />;
  }

  const organizationResponse = await getUsersAvailableOrganizationUnitsApi();
  if (isErrorOnRequest(organizationResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={organizationResponse.message} />;
  }

  const userRolesResponse = await getUsersByIdRolesApi(userId);
  if (isErrorOnRequest(userRolesResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={userRolesResponse.message} />;
  }

  const userOrganizationResponse = await getUsersByIdOrganizationUnitsApi(userId);
  if (isErrorOnRequest(userOrganizationResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={userOrganizationResponse.message} />;
  }

  return (
    <>
      <Form
        languageData={languageData}
        organizationList={organizationResponse.data.items || []}
        roleList={rolesResponse.data.items || []}
        userDetailsData={userDetailsResponse.data}
        userOrganizationUnits={userOrganizationResponse.data}
        userRoles={userRolesResponse.data.items || []}
      />
      <div className="hidden" id="page-title">
        {`${languageData.User} (${userDetailsResponse.data.userName})`}
      </div>
      <div className="hidden" id="page-description">
        {languageData["User.Update.Description"]}
      </div>
    </>
  );
}
