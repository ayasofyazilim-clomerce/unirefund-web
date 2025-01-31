"use server";

import {
  getAllRolesApi,
  getUsersAvailableOrganizationUnitsApi,
} from "src/actions/core/IdentityService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import { getResourceData } from "src/language-data/core/IdentityService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import Form from "./_components/form";

export default async function Page({ params }: { params: { lang: string } }) {
  const { lang } = params;
  const { languageData } = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["AbpIdentity.Users.Create"],
    lang,
  });

  const rolesResponse = await getAllRolesApi();
  if (isErrorOnRequest(rolesResponse, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={rolesResponse.message}
      />
    );
  }

  const organizationResponse = await getUsersAvailableOrganizationUnitsApi();
  if (isErrorOnRequest(organizationResponse, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={organizationResponse.message}
      />
    );
  }

  return (
    <>
      <Form
        languageData={languageData}
        organizationList={organizationResponse.data.items || []}
        roleList={rolesResponse.data.items || []}
      />
      <div className="hidden" id="page-description">
        {languageData["User.Create.Description"]}
      </div>
    </>
  );
}
