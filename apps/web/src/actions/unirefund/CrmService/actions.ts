"use server";
import type {
  GetApiCrmServiceAffiliationCodesData,
  GetApiCrmServiceCustomsData,
  GetApiCrmServiceIndividualsData,
  GetApiCrmServiceMerchantsByIdAffiliationsData,
  GetApiCrmServiceMerchantsByIdSubMerchantsData,
  GetApiCrmServiceMerchantsData,
  GetApiCrmServiceRefundPointsAccessibleData,
  GetApiCrmServiceRefundPointsData,
  GetApiCrmServiceTaxFreesData,
  GetApiCrmServiceTaxOfficesData,
  UniRefund_CRMService_Merchants_StoreProfilePagedResultDto,
} from "@ayasofyazilim/saas/CRMService";
import type { ServerResponse } from "src/lib";
import {
  getCRMServiceClient,
  structuredError,
  structuredResponse,
  structuredSuccessResponse,
} from "src/lib";
import { getApiRequests } from "../../api-requests";

export async function getMerchantsApi(
  data: GetApiCrmServiceMerchantsData = {},
) {
  try {
    const requests = await getApiRequests();
    const response = await requests.merchants.get(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getMerchantEmailByIdApi(id: string) {
  try {
    const crmClient = await getCRMServiceClient();
    const response =
      await crmClient.merchant.getApiCrmServiceMerchantsByIdEmails({ id });
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getMerchantPhoneByIdApi(id: string) {
  try {
    const crmClient = await getCRMServiceClient();
    const response =
      await crmClient.merchant.getApiCrmServiceMerchantsByIdTelephones({ id });
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getMerchantByIdApi(id: string) {
  try {
    const requests = await getApiRequests();
    const response = await requests.merchants.getById(id);
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getSubMerchantsByMerchantIdApi(
  data: GetApiCrmServiceMerchantsByIdSubMerchantsData,
): Promise<
  ServerResponse<UniRefund_CRMService_Merchants_StoreProfilePagedResultDto>
> {
  try {
    const requests = await getApiRequests();
    const response = await requests.merchants.getSubCompanies({
      ...data,
      maxResultCount: data.maxResultCount || 10,
      skipCount: data.skipCount || 0,
    });
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function getTaxFreesApi(data: GetApiCrmServiceTaxFreesData = {}) {
  try {
    const requests = await getApiRequests();
    const response = await requests["tax-free"].get(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function getAccessibleRefundPointsApi(
  data: GetApiCrmServiceRefundPointsAccessibleData = {},
) {
  try {
    const crmClient = await getCRMServiceClient();
    const response =
      await crmClient.refundPoint.getApiCrmServiceRefundPointsAccessible(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getRefundPointsApi(
  data: GetApiCrmServiceRefundPointsData = {},
) {
  try {
    const requests = await getApiRequests();
    const response = await requests["refund-points"].get(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function getRefundPointDetailsByIdApi(id: string) {
  try {
    const requests = await getApiRequests();
    const response = await requests["refund-points"].getDetail(id);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function getTaxOfficesApi(
  data: GetApiCrmServiceTaxOfficesData = {},
) {
  try {
    const requests = await getApiRequests();
    const response = await requests["tax-offices"].get(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}

export async function getCustomsApi(data: GetApiCrmServiceCustomsData = {}) {
  try {
    const requests = await getApiRequests();
    const response = await requests.customs.get(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getAdressesApi(id: string, partyName: "merchants") {
  try {
    const requests = await getApiRequests();
    const response = await requests[partyName].getAdresses({
      id,
    });
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getIndividualsApi(
  data: GetApiCrmServiceIndividualsData = {},
) {
  try {
    const requests = await getApiRequests();
    const response = await requests.individuals.get(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function getIndividualsByIdApi(
  partyName:
    | "merchants"
    | "refund-points"
    | "customs"
    | "tax-offices"
    | "tax-free",
  params: GetApiCrmServiceMerchantsByIdAffiliationsData,
) {
  try {
    const requests = await getApiRequests();
    const response = await requests[partyName].getIndivuals(params);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getAffiliationCodeApi(
  data: GetApiCrmServiceAffiliationCodesData,
) {
  try {
    const crmClient = await getCRMServiceClient();
    const response =
      await crmClient.affiliationCode.getApiCrmServiceAffiliationCodes(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getMerchantsByIdProductGroupApi(id: string) {
  try {
    const crmClient = await getCRMServiceClient();
    const response =
      await crmClient.merchant.getApiCrmServiceMerchantsByIdProductGroup({
        id,
      });
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
