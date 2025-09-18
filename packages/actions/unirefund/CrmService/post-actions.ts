"use server";
import {
  PostApiCrmServiceCustomsByIdAffiliationsData,
  PostApiCrmServiceMerchantsBulkProductGroupMerchantsData,
  PostApiCrmServiceMerchantsByIdAffiliationsData,
  PostApiCrmServiceMerchantsByIdProductGroupsData,
  PostApiCrmServiceMerchantsByMerchantIdProductGroupByProductGroupIdDefaultData,
  PostApiCrmServiceRefundPointsByIdAffiliationsData,
  PostApiCrmServiceTaxFreesByIdAffiliationsData,
  PostApiCrmServiceTaxOfficesByIdAffiliationsData,
  UniRefund_CRMService_Customs_CreateCustomDto,
  UniRefund_CRMService_Individuals_CreateIndividualDto,
  UniRefund_CRMService_TaxFrees_CreateTaxFreeDto,
  UniRefund_CRMService_TaxOffices_CreateTaxOfficeDto,
} from "@repo/saas/CRMService";
import { UniRefund_CRMService_RefundPoints_CreateRefundPointDto } from "@repo/saas/CRMService";
import { UniRefund_CRMService_Merchants_CreateMerchantDto } from "@repo/saas/CRMService";
import { structuredError, structuredSuccessResponse } from "@repo/utils/api";
import type { Session } from "@repo/utils/auth";
import { getCRMServiceClient } from "../lib";
/* Merchant */
export async function postMerchantApi(
  data: UniRefund_CRMService_Merchants_CreateMerchantDto,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.merchant.postApiCrmServiceMerchants({ requestBody: data });
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function postMerchantsBulkProductGroupMerchantsApi(
  data: PostApiCrmServiceMerchantsBulkProductGroupMerchantsData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.merchant.postApiCrmServiceMerchantsBulkProductGroupMerchants(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function postMerchantProductGroupsApi(
  data: PostApiCrmServiceMerchantsByIdProductGroupsData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.merchant.postApiCrmServiceMerchantsByIdProductGroups(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function postMerchantProductGroupByProductGroupIdDefaultApi(
  data: PostApiCrmServiceMerchantsByMerchantIdProductGroupByProductGroupIdDefaultData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response =
      await crmClient.merchant.postApiCrmServiceMerchantsByMerchantIdProductGroupByProductGroupIdDefault(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function postMerchantAffiliationApi(
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
/* RefundPoint */
export async function postRefundPointApi(
  data: UniRefund_CRMService_RefundPoints_CreateRefundPointDto,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.refundPoint.postApiCrmServiceRefundPoints({ requestBody: data });
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function postRefundPointAffiliationApi(
  data: PostApiCrmServiceRefundPointsByIdAffiliationsData,
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
/* TaxFree */
export async function postTaxFreeApi(data: UniRefund_CRMService_TaxFrees_CreateTaxFreeDto, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxFree.postApiCrmServiceTaxFrees({ requestBody: data });
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function postTaxFreeAffiliationApi(
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
/* Custom */
export async function postCustomApi(data: UniRefund_CRMService_Customs_CreateCustomDto, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.custom.postApiCrmServiceCustoms({ requestBody: data });
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function postCustomAffiliationApi(
  data: PostApiCrmServiceCustomsByIdAffiliationsData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.custom.postApiCrmServiceCustomsByIdAffiliations(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
/* TaxOffice */
export async function postTaxOfficeApi(
  data: UniRefund_CRMService_TaxOffices_CreateTaxOfficeDto,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxOffice.postApiCrmServiceTaxOffices({ requestBody: data });
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function postTaxOfficesAffiliationApi(
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
/* Individual */
export async function postIndividualApi(
  data: UniRefund_CRMService_Individuals_CreateIndividualDto,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.individual.postApiCrmServiceIndividuals({ requestBody: data });
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
