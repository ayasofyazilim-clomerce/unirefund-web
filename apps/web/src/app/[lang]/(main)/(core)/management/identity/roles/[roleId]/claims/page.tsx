"use server";

import {isUnauthorized} from "@repo/utils/policies";
import {isErrorOnRequest} from "@repo/utils/api";
import {
  getAllRoleClaimsApi,
  getRoleDetailsByIdApi,
  getRolesByIdClaimsApi,
} from "src/actions/core/IdentityService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import {getResourceData} from "src/language-data/core/IdentityService";
import Form from "./_components/form";

export default async function Page({params}: {params: {lang: string; roleId: string}}) {
  const {lang, roleId} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["AbpIdentity.Roles.Update"],
    lang,
  });

  const claimsResponse = await getAllRoleClaimsApi();
  if (isErrorOnRequest(claimsResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={claimsResponse.message} />;
  }

  const roleClaimsResponse = await getRolesByIdClaimsApi(roleId);
  if (isErrorOnRequest(roleClaimsResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={roleClaimsResponse.message} />;
  }

  const roleDetailsResponse = await getRoleDetailsByIdApi(roleId);
  if (isErrorOnRequest(roleDetailsResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={roleDetailsResponse.message} />;
  }

  return (
    <>
      <Form claimsData={claimsResponse.data} languageData={languageData} roleClaimsData={roleClaimsResponse.data} />
      <div className="hidden" id="page-title">
        {`${languageData.Role} (${roleDetailsResponse.data.name})`}
      </div>
      <div className="hidden" id="page-description">
        {languageData["Role.ClaimType.Description"]}
      </div>
    </>
  );
}
