"use server";

import type {
  PostApiCrmServiceAffiliationCodesData,
  PostApiCrmServiceMerchantsBulkProductGroupMerchantsData,
  PostApiCrmServiceMerchantsByIdAffiliationsData,
  PostApiCrmServiceMerchantsByIdProductGroupByProductGroupIdDefaultData,
  PostApiCrmServiceMerchantsByIdProductGroupsData,
  PostApiCrmServiceTaxFreesByIdAffiliationsData,
} from "@ayasofyazilim/saas/CRMService";
import type { Session } from "@repo/utils/auth";
import {
  getCRMServiceClient,
  structuredError,
  structuredResponse,
  structuredSuccessResponse,
} from "src/lib";
import { getApiRequests } from "../../api-requests";

export async function postAffiliationsToMerchantApi(
  data: PostApiCrmServiceMerchantsByIdAffiliationsData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response =
      await crmClient.merchant.postApiCrmServiceMerchantsByIdAffiliations(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function postAffiliationsToRefundPointApi(
  data: PostApiCrmServiceMerchantsByIdAffiliationsData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response =
      await crmClient.refundPoint.postApiCrmServiceRefundPointsByIdAffiliations(
        data,
      );
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function postAffiliationsToTaxFreeApi(
  data: PostApiCrmServiceTaxFreesByIdAffiliationsData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response =
      await crmClient.taxFree.postApiCrmServiceTaxFreesByIdAffiliations(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

//Unupdated
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

export async function postMerchantsByIdProductGroupsApi(
  data: PostApiCrmServiceMerchantsByIdProductGroupsData,
) {
  try {
    const crmClient = await getCRMServiceClient();
    const response =
      await crmClient.merchant.postApiCrmServiceMerchantsByIdProductGroups(
        data,
      );
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function postMerchantsByIdProductGroupByProductGroupIdDefaultApi(
  data: PostApiCrmServiceMerchantsByIdProductGroupByProductGroupIdDefaultData,
) {
  try {
    const crmClient = await getCRMServiceClient();
    const response =
      await crmClient.merchant.postApiCrmServiceMerchantsByIdProductGroupByProductGroupIdDefault(
        data,
      );
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
