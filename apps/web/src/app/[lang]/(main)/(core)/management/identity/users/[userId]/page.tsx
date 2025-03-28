"use server";

import {
  getAllRolesApi,
  getUserDetailsByIdApi,
  getUsersAvailableOrganizationUnitsApi,
  getUsersByIdOrganizationUnitsApi,
  getUsersByIdRolesApi,
} from "@repo/actions/core/IdentityService/actions";
import ErrorComponent from "@repo/ui/components/error-component";
import {isErrorOnRequest, structuredError} from "@repo/utils/api";
import {auth} from "@repo/utils/auth/next-auth";
import {isUnauthorized} from "@repo/utils/policies";
import {isRedirectError} from "next/dist/client/components/redirect";
import {getResourceData} from "src/language-data/core/IdentityService";
import Form from "./_components/form";

async function getApiRequests() {
  try {
    const session = await auth();
    const requiredRequests = await Promise.all([]);

    const optionalRequests = await Promise.allSettled([getAllRolesApi(session)]);
    return {requiredRequests, optionalRequests};
  } catch (error) {
    if (!isRedirectError(error)) {
      return structuredError(error);
    }
    throw error;
  }
}
export default async function Page({params}: {params: {lang: string; userId: string}}) {
  const {lang, userId} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["AbpIdentity.Users.Update"],
    lang,
  });

  const apiRequests = await getApiRequests();

  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message} />;
  }
  const {optionalRequests} = apiRequests;
  const [allRolesResponse] = optionalRequests;

  const allRoles = allRolesResponse.status === "fulfilled" ? allRolesResponse.value.data.items || [] : [];
  const userDetailsResponse = await getUserDetailsByIdApi(userId);
  if (isErrorOnRequest(userDetailsResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={userDetailsResponse.message} />;
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
        roleList={allRoles}
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
