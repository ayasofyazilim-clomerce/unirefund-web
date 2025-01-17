"use server";

import type {
  PostApiCrmServiceAffiliationCodesData,
  PostApiCrmServiceMerchantsBulkProductGroupMerchantsData,
  PostApiCrmServiceMerchantsByIdAffiliationsData,
} from "@ayasofyazilim/saas/CRMService";
import {
  getCRMServiceClient,
  structuredError,
  structuredResponse,
} from "src/lib";
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
export async function postProductGroupsToMerchantsApi(
  data: PostApiCrmServiceMerchantsBulkProductGroupMerchantsData,
) {
  try {
    const crmClient = await getCRMServiceClient();
    const response =
      await crmClient.merchant.postApiCrmServiceMerchantsBulkProductGroupMerchants(
        data,
      );
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function postAffiliationsApi(
  data: PostApiCrmServiceAffiliationCodesData,
) {
  try {
    const crmClient = await getCRMServiceClient();
    const response =
      await crmClient.affiliationCode.postApiCrmServiceAffiliationCodes(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function postAbpUserAccountByIndividualIdApi(id: string) {
  try {
    const crmClient = await getCRMServiceClient();
    const response =
      await crmClient.individual.postApiCrmServiceIndividualsByIdAbpUserAccount(
        { id },
      );
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
