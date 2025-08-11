"use server";

import type {GetApiCrmServiceCustomsByCustomIdAffiliationsData} from "@ayasofyazilim/unirefund-saas-dev/CRMService";
import {getIndividualsApi, getCustomAffiliationsByCustomIdApi} from "@repo/actions/unirefund/CrmService/actions";
import ErrorComponent from "@repo/ui/components/error-component";
import {isErrorOnRequest, structuredError} from "@repo/utils/api";
import {auth} from "@repo/utils/auth/next-auth";
import {isRedirectError} from "next/dist/client/components/redirect";
import {getRolesApi, getUsersApi} from "@repo/actions/core/IdentityService/actions";
import {getResourceData} from "src/language-data/unirefund/CRMService";
import AffiliationsTable from "../../../_components/affiliations/table";

async function getApiRequests(filters: GetApiCrmServiceCustomsByCustomIdAffiliationsData) {
  try {
    const session = await auth();
    const requiredRequests = await Promise.all([getCustomAffiliationsByCustomIdApi(filters, session)]);
    const optionalRequests = await Promise.allSettled([getIndividualsApi(filters, session)]);
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
  searchParams?: GetApiCrmServiceCustomsByCustomIdAffiliationsData;
}) {
  const {lang, partyId} = params;
  const {languageData} = await getResourceData(lang);

  const apiRequests = await getApiRequests({
    customId: partyId,
    name: searchParams?.name || "",
    roleName: searchParams?.roleName || "",
    maxResultCount: searchParams?.maxResultCount || 10,
    skipCount: searchParams?.skipCount || 0,
  });
  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message} />;
  }

  const [affiliationsResponse] = apiRequests.requiredRequests;
  const [individualsResponse] = apiRequests.optionalRequests;

  const roleResponse = await getRolesApi({});
  const usersResponse = await getUsersApi({});

  const isRolesAvailable = !isErrorOnRequest(roleResponse, lang, false);
  const isUsersAvailable = !isErrorOnRequest(usersResponse, lang, false);
  const isIndividualsAvailable = individualsResponse.status !== "rejected";

  return (
    <AffiliationsTable
      affiliations={affiliationsResponse.data}
      individuals={individualsResponse.status === "fulfilled" ? individualsResponse.value.data.items || [] : []}
      isIndividualsAvailable={isIndividualsAvailable}
      isRolesAvailable={isRolesAvailable}
      isUsersAvailable={isUsersAvailable}
      languageData={languageData}
      roles={isRolesAvailable ? roleResponse.data.items || [] : []}
      users={isUsersAvailable ? usersResponse.data.items || [] : []}
    />
  );
}
