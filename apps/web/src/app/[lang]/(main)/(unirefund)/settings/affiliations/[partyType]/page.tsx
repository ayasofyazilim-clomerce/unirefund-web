"use server";

import { getAssignableRolesByCurrentUserApi } from "src/actions/core/IdentityService/actions";
import { getAffiliationCodeApi } from "src/actions/unirefund/CrmService/actions";
import type { PartyNameType } from "src/actions/unirefund/CrmService/types";
import { partyNameToEntityPartyTypeCode } from "src/actions/unirefund/CrmService/types";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import { getResourceData } from "src/language-data/unirefund/CRMService";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import AffiliationsTable from "./_components/table";

export default async function Page({
  params,
}: {
  params: {
    lang: string;
    partyType: Exclude<PartyNameType, "individuals">;
  };
}) {
  const { lang, partyType } = params;
  const { languageData } = await getResourceData(lang);

  const affiliationCodesResponse = await getAffiliationCodeApi({
    entityPartyTypeCode: partyNameToEntityPartyTypeCode[partyType],
  });
  if (isErrorOnRequest(affiliationCodesResponse, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={affiliationCodesResponse.message}
      />
    );
  }

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
