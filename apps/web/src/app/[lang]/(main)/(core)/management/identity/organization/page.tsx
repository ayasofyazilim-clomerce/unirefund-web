"use server";

import type {GetApiIdentityRolesData, GetApiIdentityUsersData} from "@ayasofyazilim/saas/IdentityService";
import {isUnauthorized} from "@repo/utils/policies";
import {getAllOrganizationUnitsApi, getRolesApi, getUsersApi} from "src/actions/core/IdentityService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import {getResourceData} from "src/language-data/core/IdentityService";
import {isErrorOnRequest} from "src/utils/page-policy/utils";
import OrganizationComponent from "./organization";

export default async function Page({
  params,
  searchParams,
}: {
  params: {
    lang: string;
  };
  searchParams: GetApiIdentityUsersData & GetApiIdentityRolesData;
}) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["AbpIdentity.OrganizationUnits"],
    lang,
  });
  const organizationResponse = await getAllOrganizationUnitsApi();
  if (isErrorOnRequest(organizationResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={organizationResponse.message} />;
  }

  const usersResponse = await getUsersApi(searchParams);
  if (isErrorOnRequest(usersResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={usersResponse.message} />;
  }

  const roleResponse = await getRolesApi(searchParams);
  if (isErrorOnRequest(roleResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={roleResponse.message} />;
  }

  return (
    <OrganizationComponent
      languageData={languageData}
      organizationUnitList={organizationResponse.data}
      roleList={roleResponse.data}
      userList={usersResponse.data}
    />
  );
}
