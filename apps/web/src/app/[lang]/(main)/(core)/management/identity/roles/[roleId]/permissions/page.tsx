"use server";

import {isUnauthorized} from "@repo/utils/policies";
import {getPermissionsApi} from "src/actions/core/AdministrationService/actions";
import {getRoleDetailsByIdApi} from "src/actions/core/IdentityService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import {getResourceData} from "src/language-data/core/IdentityService";
import {isErrorOnRequest} from "src/utils/page-policy/utils";
import RolePermissions from "./_components/permissions";

export default async function Page({params}: {params: {lang: string; roleId: string}}) {
  const {lang, roleId} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["AbpIdentity.Roles.ManagePermissions"],
    lang,
  });

  const roleDetailsResponse = await getRoleDetailsByIdApi(roleId);
  if (isErrorOnRequest(roleDetailsResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={roleDetailsResponse.message} />;
  }

  const rolePermissionsResponse = await getPermissionsApi({
    providerKey: roleDetailsResponse.data.name || "",
    providerName: "R",
  });
  if (isErrorOnRequest(rolePermissionsResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={rolePermissionsResponse.message} />;
  }

  return (
    <>
      <RolePermissions languageData={languageData} rolePermissionsData={rolePermissionsResponse.data} />
      <div className="hidden" id="page-title">
        {`${languageData.Role} (${roleDetailsResponse.data.name})`}
      </div>
      <div className="hidden" id="page-description">
        {languageData["Role.Permissions.Description"]}
      </div>
    </>
  );
}
