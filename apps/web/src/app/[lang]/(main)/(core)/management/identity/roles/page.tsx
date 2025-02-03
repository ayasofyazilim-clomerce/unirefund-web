"use server";

import type { GetApiIdentityRolesData } from "@ayasofyazilim/saas/IdentityService";
import { isUnauthorized } from "@repo/utils/policies";
import { getRolesApi } from "src/actions/core/IdentityService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import { getResourceData } from "src/language-data/core/IdentityService";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import RolesTable from "./_components/table";

export default async function Page({
  params,
  searchParams,
}: {
  params: { lang: string };
  searchParams: GetApiIdentityRolesData;
}) {
  const { lang } = params;
  const { languageData } = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["AbpIdentity.Roles"],
    lang,
  });

  const rolesResponse = await getRolesApi(searchParams);
  if (isErrorOnRequest(rolesResponse, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={rolesResponse.message}
      />
    );
  }

  return (
    <RolesTable languageData={languageData} response={rolesResponse.data} />
  );
}
