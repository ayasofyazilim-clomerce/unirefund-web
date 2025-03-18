"use server";

import {auth} from "@repo/utils/auth/next-auth";
import {isUnauthorized} from "@repo/utils/policies";
import ErrorComponent from "@repo/ui/components/error-component";
import {getAffiliationCodesDetailsByIdApi} from "@repo/actions/unirefund/CrmService/actions";
import type {PartyNameType} from "@repo/actions/unirefund/CrmService/types";
import {getAssignableRolesByCurrentUserApi} from "@repo/actions/core/IdentityService/actions";
import {getResourceData} from "@/language-data/unirefund/CRMService";
import Form from "./_components/form";

async function getApiRequests(affiliationId: number) {
  try {
    const session = await auth();
    const apiRequests = await Promise.all([
      getAssignableRolesByCurrentUserApi(session),
      getAffiliationCodesDetailsByIdApi(affiliationId, session),
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
    affiliationId: number;
  };
}) {
  const {lang, affiliationId, partyType} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["CRMService.AffiliationCodes.Edit"],
    lang,
  });

  const apiRequests = await getApiRequests(affiliationId);
  if (apiRequests.type === "error") {
    return <ErrorComponent languageData={languageData} message={apiRequests.message || "Unknown error occurred"} />;
  }

  const [assignableRolesResponse, affiliationCodesDetailsResponse] = apiRequests.data;

  return (
    <Form
      affiliationCodesDetails={affiliationCodesDetailsResponse.data}
      affiliationId={affiliationId}
      assignableRolesData={assignableRolesResponse.data}
      languageData={languageData}
      partyType={partyType}
    />
  );
}
