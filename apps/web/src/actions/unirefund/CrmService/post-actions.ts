"use server";

import type {
  PostApiCrmServiceAffiliationCodesData,
  PostApiCrmServiceCustomsByIdAffiliationsData,
  PostApiCrmServiceCustomsWithComponentsData,
  PostApiCrmServiceIndividualsWithComponentsData,
  PostApiCrmServiceMerchantsBulkProductGroupMerchantsData,
  PostApiCrmServiceMerchantsByIdAffiliationsData,
  PostApiCrmServiceMerchantsByIdProductGroupByProductGroupIdDefaultData,
  PostApiCrmServiceMerchantsByIdProductGroupsData,
  PostApiCrmServiceMerchantsWithComponentsData,
  PostApiCrmServiceRefundPointsWithComponentsData,
  PostApiCrmServiceTaxFreesByIdAffiliationsData,
  PostApiCrmServiceTaxFreesWithComponentsData,
  PostApiCrmServiceTaxOfficesByIdAffiliationsData,
  PostApiCrmServiceTaxOfficesWithComponentsData,
} from "@ayasofyazilim/saas/CRMService";
import {structuredError, structuredResponse, structuredSuccessResponse} from "@repo/utils/api";
import type {Session} from "@repo/utils/auth";
import {getCRMServiceClient} from "src/lib";

export async function postAffiliationsToMerchantApi(
  data: PostApiCrmServiceMerchantsByIdAffiliationsData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.merchant.postApiCrmServiceMerchantsByIdAffiliations(data);
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
    const response = await crmClient.refundPoint.postApiCrmServiceRefundPointsByIdAffiliations(data);
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
    const response = await crmClient.taxFree.postApiCrmServiceTaxFreesByIdAffiliations(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function postAffiliationsToTaxOfficeApi(
  data: PostApiCrmServiceTaxOfficesByIdAffiliationsData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxOffice.postApiCrmServiceTaxOfficesByIdAffiliations(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function postAffiliationsToCustomApi(
  data: PostApiCrmServiceCustomsByIdAffiliationsData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.customs.postApiCrmServiceCustomsByIdAffiliations(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function postMerchantsWithComponentsApi(
  data: PostApiCrmServiceMerchantsWithComponentsData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.merchant.postApiCrmServiceMerchantsWithComponents(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function postRefundPointsWithComponentsApi(
  data: PostApiCrmServiceRefundPointsWithComponentsData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.refundPoint.postApiCrmServiceRefundPointsWithComponents(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function postCustomsWithComponentsApi(
  data: PostApiCrmServiceCustomsWithComponentsData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.customs.postApiCrmServiceCustomsWithComponents(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function postTaxFreesWithComponentsApi(
  data: PostApiCrmServiceTaxFreesWithComponentsData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxFree.postApiCrmServiceTaxFreesWithComponents(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function postTaxOfficesWithComponentsApi(
  data: PostApiCrmServiceTaxOfficesWithComponentsData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxOffice.postApiCrmServiceTaxOfficesWithComponents(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function postIndividualsWithComponentsApi(
  data: PostApiCrmServiceIndividualsWithComponentsData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.individual.postApiCrmServiceIndividualsWithComponents(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function postAffiliationCodesApi(data: PostApiCrmServiceAffiliationCodesData, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.affiliationCode.postApiCrmServiceAffiliationCodes(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
//Unupdated
export async function postProductGroupsToMerchantsApi(data: PostApiCrmServiceMerchantsBulkProductGroupMerchantsData) {
  try {
    const crmClient = await getCRMServiceClient();
    const response = await crmClient.merchant.postApiCrmServiceMerchantsBulkProductGroupMerchants(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function postAbpUserAccountByIndividualIdApi(id: string) {
  try {
    const crmClient = await getCRMServiceClient();
    const response = await crmClient.individual.postApiCrmServiceIndividualsByIdAbpUserRelation({id});
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function postMerchantsByIdProductGroupsApi(data: PostApiCrmServiceMerchantsByIdProductGroupsData) {
  try {
    const crmClient = await getCRMServiceClient();
    const response = await crmClient.merchant.postApiCrmServiceMerchantsByIdProductGroups(data);
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
    const response = await crmClient.merchant.postApiCrmServiceMerchantsByIdProductGroupByProductGroupIdDefault(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
