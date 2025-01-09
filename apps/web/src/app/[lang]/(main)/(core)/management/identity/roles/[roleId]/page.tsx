"use server";

import { getRoleDetailsByIdApi } from "src/actions/core/IdentityService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import { getResourceData } from "src/language-data/core/IdentityService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import Form from "./_components/form";

export default async function Page({
  params,
}: {
  params: { lang: string; roleId: string };
}) {
  const { lang, roleId } = params;
  const { languageData } = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["AbpIdentity.Roles.Update"],
    lang,
  });

  const roleDetailsResponse = await getRoleDetailsByIdApi(roleId);
  if (isErrorOnRequest(roleDetailsResponse, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={roleDetailsResponse.message}
      />
    );
  }

  return (
    <>
      <Form languageData={languageData} response={roleDetailsResponse.data} />
      <div className="hidden" id="page-title">
        {`${languageData.Role} (${roleDetailsResponse.data.name})`}
      </div>
      <div className="hidden" id="page-description">
        {languageData["Role.Update.Description"]}
      </div>
    </>
  );
}
