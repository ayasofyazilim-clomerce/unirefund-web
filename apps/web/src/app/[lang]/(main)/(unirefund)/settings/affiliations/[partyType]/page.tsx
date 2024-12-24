"use server";

import { getAffiliationCodeApi } from "src/actions/unirefund/CrmService/actions";
import { getResourceData } from "src/language-data/unirefund/CRMService";
import { getAssignableRolesByCurrentUserApi } from "src/actions/core/IdentityService/actions";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import AffiliationsTable from "./_components/table";

export default async function Page({
  params,
}: {
  params: {
    lang: string;
  };
}) {
  const { lang } = params;
  const { languageData } = await getResourceData(lang);

  const affiliationCodesResponse = await getAffiliationCodeApi();
  if (isErrorOnRequest(affiliationCodesResponse, lang)) return;

  const affiliationCodes = affiliationCodesResponse.data;

  const assignableRolesResponse = await getAssignableRolesByCurrentUserApi();
  if (isErrorOnRequest(assignableRolesResponse, lang)) return;

  const assignableRoles = assignableRolesResponse.data.sort((a, b) => {
    if (a.isAssignable === b.isAssignable) return 0;
    if (a.isAssignable) return -1;
    return 1;
  });

  return (
    <AffiliationsTable
      assignableRoles={assignableRoles}
      languageData={languageData}
      response={affiliationCodes}
    />
  );
}
