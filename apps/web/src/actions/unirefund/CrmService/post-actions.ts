"use server";

import type { PostApiCrmServiceMerchantsByIdAffiliationsData } from "@ayasofyazilim/saas/CRMService";
import { structuredError, structuredResponse } from "src/lib";
import { getApiRequests } from "../../api-requests";

export async function postAffiliationsToPartyApi(
  partyType:
    | "merchants"
    | "refund-points"
    | "customs"
    | "tax-free"
    | "tax-offices",
  data: PostApiCrmServiceMerchantsByIdAffiliationsData,
) {
  try {
    const requests = await getApiRequests();
    const response = await requests[partyType].postAffiliations(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
