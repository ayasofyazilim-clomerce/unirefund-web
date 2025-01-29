"use server";

import type { UniRefund_CRMService_Enums_EntityPartyTypeCode } from "@ayasofyazilim/saas/CRMService";
import { auth } from "@repo/utils/auth/next-auth";
import { getAssignableRolesByCurrentUserApi } from "src/actions/core/IdentityService/actions";
import { getAffiliationCodeApi } from "src/actions/unirefund/CrmService/actions";
import type { PartyNameType } from "src/actions/unirefund/CrmService/types";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import { getResourceData } from "src/language-data/unirefund/CRMService";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import AffiliationsTable from "./_components/table";

const entityPartyTypeCodeMap: Record<
  Exclude<PartyNameType, "individuals">,
  UniRefund_CRMService_Enums_EntityPartyTypeCode
> = {
  customs: "CUSTOMS",
  merchants: "MERCHANT",
  "refund-points": "REFUNDPOINT",
  "tax-free": "TAXFREE",
  "tax-offices": "TAXOFFICE",
};

async function getApiRequests(
  entityPartyTypeCode: UniRefund_CRMService_Enums_EntityPartyTypeCode,
) {
  try {
    const session = await auth();
    const apiRequests = await Promise.all([
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
    const err = error as { data?: string; message?: string };
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
  const { lang, partyType } = params;
  const { languageData } = await getResourceData(lang);

  const apiRequests = await getApiRequests(entityPartyTypeCodeMap[partyType]);

  if (apiRequests.type === "error") {
    return (
      <ErrorComponent
        languageData={languageData}
        message={apiRequests.message || "Unknown error occurred"}
      />
    );
  }

  const [affiliationCodesResponse] = apiRequests.data;
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
