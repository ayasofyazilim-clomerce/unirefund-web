"use server";

import {getAssignableRolesApi} from "@repo/actions/core/IdentityService/actions";
import {getMerchantAffiliationsByIdApi} from "@repo/actions/unirefund/CrmService/actions";
import type {GetApiCrmServiceMerchantsByIdAffiliationsData} from "@repo/saas/CRMService";
import ErrorComponent from "@repo/ui/components/error-component";
import {isErrorOnRequest, structuredError} from "@repo/utils/api";
import {auth} from "@repo/utils/auth/next-auth";
import {isRedirectError} from "next/dist/client/components/redirect";
import type {Session} from "@repo/utils/auth";
import {getResourceData} from "src/language-data/unirefund/CRMService";
import AffiliationsTable from "../../../_components/affiliations/table";

async function getApiRequests(filters: GetApiCrmServiceMerchantsByIdAffiliationsData, session: Session | null) {
  try {
    const requiredRequests = await Promise.all([getMerchantAffiliationsByIdApi(filters, session)]);
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
  searchParams?: GetApiCrmServiceMerchantsByIdAffiliationsData;
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
      partyType="merchants"
      roles={isRolesAvailable ? roleResponse.data : []}
    />
  );
}
