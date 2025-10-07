"use server";

import {getAssignableRolesApi} from "@repo/actions/core/IdentityService/actions";
import {getTaxOfficeAffiliationsByIdApi} from "@repo/actions/unirefund/CrmService/actions";
import type {GetApiCrmServiceTaxOfficesByIdAffiliationsData} from "@repo/saas/CRMService";
import ErrorComponent from "@repo/ui/components/error-component";
import {isErrorOnRequest, structuredError} from "@repo/utils/api";
import type {Session} from "@repo/utils/auth";
import {auth} from "@repo/utils/auth/next-auth";
import {isRedirectError} from "next/dist/client/components/redirect";
import {getResourceData} from "src/language-data/unirefund/CRMService";
import AffiliationsTable from "../../../_components/affiliations/table";

async function getApiRequests(filters: GetApiCrmServiceTaxOfficesByIdAffiliationsData, session: Session | null) {
  try {
    const requiredRequests = await Promise.all([getTaxOfficeAffiliationsByIdApi(filters, session)]);
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
  searchParams?: GetApiCrmServiceTaxOfficesByIdAffiliationsData;
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
      partyType="tax-offices"
      roles={isRolesAvailable ? roleResponse.data : []}
    />
  );
}
