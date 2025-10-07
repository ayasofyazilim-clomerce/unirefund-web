"use server";

import {getAssignableRolesApi} from "@repo/actions/core/IdentityService/actions";
import {getRefundPointAffiliationsByIdApi} from "@repo/actions/unirefund/CrmService/actions";
import type {GetApiCrmServiceRefundPointsByIdAffiliationsData} from "@repo/saas/CRMService";
import ErrorComponent from "@repo/ui/components/error-component";
import {isErrorOnRequest, structuredError} from "@repo/utils/api";
import type {Session} from "@repo/utils/auth";
import {auth} from "@repo/utils/auth/next-auth";
import {isRedirectError} from "next/dist/client/components/redirect";
import {getResourceData} from "src/language-data/unirefund/CRMService";
import AffiliationsTable from "../../../_components/affiliations/table";

async function getApiRequests(filters: GetApiCrmServiceRefundPointsByIdAffiliationsData, session: Session | null) {
  try {
    const requiredRequests = await Promise.all([getRefundPointAffiliationsByIdApi(filters, session)]);
    const optionalRequests = await Promise.allSettled([]);
    return {requiredRequests, optionalRequests};
  } catch (error) {
    if (!isRedirectError(error)) {
      return structuredError(error);
    }
    throw error;
  }
}
export default async function Page({
  params,
  searchParams,
}: {
  params: {
    partyId: string;
    lang: string;
  };
  searchParams?: GetApiCrmServiceRefundPointsByIdAffiliationsData;
}) {
  const {lang, partyId} = params;
  const {languageData} = await getResourceData(lang);

  const session = await auth();
  const apiRequests = await getApiRequests(
    {
      id: partyId,
      name: searchParams?.name || "",
      roleName: searchParams?.roleName || "",
      maxResultCount: searchParams?.maxResultCount || 10,
      skipCount: searchParams?.skipCount || 0,
    },
    session,
  );
  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message} />;
  }

  const [affiliationsResponse] = apiRequests.requiredRequests;

  const roleResponse = await getAssignableRolesApi("f1f7d2e9-634c-9716-36d1-3a1cd0ce6042");
  const isRolesAvailable = !isErrorOnRequest(roleResponse, lang, false);

  return (
    <AffiliationsTable
      affiliations={affiliationsResponse.data}
      isRolesAvailable={isRolesAvailable}
      languageData={languageData}
      partyType="refund-points"
      roles={isRolesAvailable ? roleResponse.data : []}
    />
  );
}
