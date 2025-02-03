"use server";

import type { GetApiIdentityUsersData } from "@ayasofyazilim/saas/IdentityService";
import { isUnauthorized } from "@repo/utils/policies";
import {
  getUsersApi,
  getUsersLookupOrganizationUnitsApi,
  getUsersLookupRolesApi,
} from "src/actions/core/IdentityService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import { getResourceData } from "src/language-data/core/IdentityService";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import UsersTable from "./_components/table";

export default async function Page({
  params,
  searchParams,
}: {
  params: { lang: string };
  searchParams: GetApiIdentityUsersData;
}) {
  const { lang } = params;
  const { languageData } = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["AbpIdentity.Users"],
    lang,
  });

  const usersResponse = await getUsersApi(searchParams);
  if (isErrorOnRequest(usersResponse, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={usersResponse.message}
      />
    );
  }

  const rolesResponse = await getUsersLookupRolesApi();
  if (isErrorOnRequest(rolesResponse, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={rolesResponse.message}
      />
    );
  }
  const organizationResponse = await getUsersLookupOrganizationUnitsApi();
  if (isErrorOnRequest(organizationResponse, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={organizationResponse.message}
      />
    );
  }

  return (
    <UsersTable
      languageData={languageData}
      organizationList={organizationResponse.data}
      response={usersResponse.data}
      roleList={rolesResponse.data}
    />
  );
}
