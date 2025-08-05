"use server";

import {GetApiCrmServiceTaxfreesByTaxFreeIdAffiliationsData} from "@ayasofyazilim/unirefund-saas-dev/CRMService";
import {getIndividualsApi, getTaxFreeAffiliationsByTaxFreeIdApi} from "@repo/actions/unirefund/CrmService/actions";
import ErrorComponent from "@repo/ui/components/error-component";
import {isErrorOnRequest, structuredError} from "@repo/utils/api";
import {auth} from "@repo/utils/auth/next-auth";
import {isRedirectError} from "next/dist/client/components/redirect";
import {getResourceData} from "src/language-data/unirefund/CRMService";
import AffiliationsTable from "../../../_components/affiliations/table";
import {getRolesApi, getUsersApi} from "@repo/actions/core/IdentityService/actions";

async function getApiRequests(filters: GetApiCrmServiceTaxfreesByTaxFreeIdAffiliationsData) {
  try {
    const session = await auth();
    const requiredRequests = await Promise.all([getTaxFreeAffiliationsByTaxFreeIdApi(filters, session)]);
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
  searchParams?: GetApiCrmServiceTaxfreesByTaxFreeIdAffiliationsData;
}) {
  const {lang, partyId} = params;
  const {languageData} = await getResourceData(lang);

  const apiRequests = await getApiRequests({
    taxFreeId: partyId,
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
      isIndividualsAvailable={isIndividualsAvailable}
      individuals={individualsResponse.status === "fulfilled" ? individualsResponse.value.data.items || [] : []}
      languageData={languageData}
      affiliations={affiliationsResponse.data}
      roles={isRolesAvailable ? roleResponse.data.items || [] : []}
      isRolesAvailable={isRolesAvailable}
      isUsersAvailable={isUsersAvailable}
      users={isUsersAvailable ? usersResponse.data.items || [] : []}
    />
  );
}
