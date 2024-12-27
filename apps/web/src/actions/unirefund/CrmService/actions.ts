"use server";
import type {
  GetApiCrmServiceRefundPointsAccessibleData,
  GetApiCrmServiceCustomsData,
  GetApiCrmServiceIndividualsData,
  GetApiCrmServiceMerchantsByIdSubMerchantsData,
  GetApiCrmServiceMerchantsData,
  GetApiCrmServiceMerchantsResponse,
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
} from "src/lib";
import { getApiRequests } from "../../api-requests";

export async function getMerchantsApi(
  data: GetApiCrmServiceMerchantsData = {},
): Promise<ServerResponse<GetApiCrmServiceMerchantsResponse>> {
  try {
    const requests = await getApiRequests();
    const response = await requests.merchants.get(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function getMerchantByIdApi(id: string) {
  try {
    const requests = await getApiRequests();
    const response = await requests.merchants.getById(id);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
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
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
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
  id: string,
) {
  try {
    const requests = await getApiRequests();
    const response = await requests[partyName].getIndivuals({
      id,
      maxResultCount: 100,
      skipCount: 0,
    });
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getAffiliationCodeApi() {
  try {
    const crmClient = await getCRMServiceClient();
    const response =
      await crmClient.affiliationCode.getApiCrmServiceAffiliationCodes();
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
