"use server";

import {isUnauthorized} from "@repo/utils/policies";
import {getAssignableRolesApi, getRoleDetailsByIdApi} from "src/actions/core/IdentityService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import {getResourceData} from "src/language-data/core/IdentityService";
import {isErrorOnRequest} from "src/utils/page-policy/utils";
import Form from "./_components/form";

export default async function Page({params}: {params: {lang: string; roleId: string}}) {
  const {lang, roleId} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["IdentityService.AssignableRoles"],
    lang,
  });

  const assignableRolesResponse = await getAssignableRolesApi(roleId);
  if (isErrorOnRequest(assignableRolesResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={assignableRolesResponse.message} />;
  }

  const roleDetailsResponse = await getRoleDetailsByIdApi(roleId);
  if (isErrorOnRequest(roleDetailsResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={roleDetailsResponse.message} />;
  }

  return (
    <>
      <Form assignableRoleList={assignableRolesResponse.data} languageData={languageData} />
      <div className="hidden" id="page-title">
        {`${languageData.Role} (${roleDetailsResponse.data.name})`}
      </div>
      <div className="hidden" id="page-description">
        {languageData["Role.Assignable.Description"]}
      </div>
    </>
  );
}
