"use server";

import type {UniRefund_CRMService_Enums_EntityPartyTypeCode} from "@ayasofyazilim/saas/CRMService";
import {auth} from "@repo/utils/auth/next-auth";
import {isUnauthorized} from "@repo/utils/policies";
import ErrorComponent from "@repo/ui/components/error-component";
import {getAssignableRolesByCurrentUserApi} from "@repo/actions/core/IdentityService/actions";
import {getAffiliationCodeApi} from "@repo/actions/unirefund/CrmService/actions";
import type {PartyNameType} from "@repo/actions/unirefund/CrmService/types";
import {getResourceData} from "src/language-data/unirefund/CRMService";
import AffiliationsTable from "./_components/table";
import {entityPartyTypeCodeMap} from "./_components/utils";

async function getApiRequests(entityPartyTypeCode: UniRefund_CRMService_Enums_EntityPartyTypeCode) {
  try {
    const session = await auth();
    const apiRequests = await Promise.all([
      getAssignableRolesByCurrentUserApi(session),
      getAffiliationCodeApi(
        {
          entityPartyTypeCode,
          maxResultCount: 1000,
        },
        session,
      ),
    ]);
    return {
      type: "success" as const,
      data: apiRequests,
    };
  } catch (error) {
    const err = error as {data?: string; message?: string};
    return {
      type: "error" as const,
      message: err.message,
    };
  }
}

export default async function Page({
  params,
}: {
  params: {
    lang: string;
    partyType: Exclude<PartyNameType, "individuals">;
  };
}) {
  const {lang, partyType} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["CRMService.AffiliationCodes"],
    lang,
  });

  const apiRequests = await getApiRequests(entityPartyTypeCodeMap[partyType]);
  if (apiRequests.type === "error") {
    return <ErrorComponent languageData={languageData} message={apiRequests.message || "Unknown error occurred"} />;
  }

  const [assignableRolesResponse, affiliationCodesResponse] = apiRequests.data;
  const affiliationCodes = affiliationCodesResponse.data;

  const assignableRoles = assignableRolesResponse.data.sort((a, b) => {
    if (a.isAssignable === b.isAssignable) return 0;
    if (a.isAssignable) return -1;
    return 1;
  });

  return (
    <AffiliationsTable assignableRoles={assignableRoles} languageData={languageData} response={affiliationCodes} />
  );
}
