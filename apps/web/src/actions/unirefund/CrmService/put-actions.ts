"use server";

import type {
  PutApiCrmServiceAffiliationCodesByIdData,
  PutApiCrmServiceMerchantsByIdAddressesByAddressIdData,
  PutApiCrmServiceMerchantsByIdData,
  PutApiCrmServiceMerchantsByIdEmailsByEmailIdData,
  PutApiCrmServiceMerchantsByIdIndividualByIndividualIdNameByNameIdData,
  PutApiCrmServiceMerchantsByIdIndividualByIndividualIdPersonalSummaryByPersonalSummaryIdData,
  PutApiCrmServiceMerchantsByIdOrganizationsByOrganizationIdData,
  PutApiCrmServiceMerchantsByIdTelephonesByTelephoneIdData,
} from "@ayasofyazilim/saas/CRMService";
import {
  getCRMServiceClient,
  structuredError,
  structuredResponse,
  structuredSuccessResponse,
} from "src/lib";
import { getApiRequests } from "../../api-requests";

export async function putMerchantBaseApi(
  data: PutApiCrmServiceMerchantsByIdData,
) {
  try {
    const requests = await getApiRequests();
    const response = await requests.merchants.putMerchantBase(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function putCrmAddressApi(
  partyName:
    | "merchants"
    | "refund-points"
    | "customs"
    | "tax-offices"
    | "tax-free",
  data: PutApiCrmServiceMerchantsByIdAddressesByAddressIdData,
) {
  try {
    const requests = await getApiRequests();
    const response = await requests[partyName].putAddress(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putMerchantEmailApi(
  data: PutApiCrmServiceMerchantsByIdEmailsByEmailIdData,
) {
  try {
    const crmClient = await getCRMServiceClient();
    const response =
      await crmClient.merchant.putApiCrmServiceMerchantsByIdEmailsByEmailId(
        data,
      );
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function putMerchantAddressApi(
  data: PutApiCrmServiceMerchantsByIdAddressesByAddressIdData,
) {
  try {
    const crmClient = await getCRMServiceClient();
    const response =
      await crmClient.merchant.putApiCrmServiceMerchantsByIdAddressesByAddressId(
        data,
      );
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function putMerchantTelephoneApi(
  data: PutApiCrmServiceMerchantsByIdTelephonesByTelephoneIdData,
) {
  try {
    const crmClient = await getCRMServiceClient();
    const response =
      await crmClient.merchant.putApiCrmServiceMerchantsByIdTelephonesByTelephoneId(
        data,
      );
    return structuredResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function putCrmEmailAddressApi(
  partyName:
    | "merchants"
    | "refund-points"
    | "customs"
    | "tax-offices"
    | "tax-free",
  data: PutApiCrmServiceMerchantsByIdEmailsByEmailIdData,
) {
  try {
    const requests = await getApiRequests();
    const response = await requests[partyName].putEmailAddress(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putCrmTelephoneApi(
  partyName:
    | "merchants"
    | "refund-points"
    | "customs"
    | "tax-offices"
    | "tax-free",
  data: PutApiCrmServiceMerchantsByIdTelephonesByTelephoneIdData,
) {
  try {
    const requests = await getApiRequests();
    const response = await requests[partyName].putTelephone(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function putCrmOrganizationApi(
  partyName:
    | "merchants"
    | "refund-points"
    | "customs"
    | "tax-offices"
    | "tax-free",
  data: PutApiCrmServiceMerchantsByIdOrganizationsByOrganizationIdData,
) {
  try {
    const requests = await getApiRequests();
    const response = await requests[partyName].putOrganization(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putCrmIndividualNameApi(
  partyName: "merchants",

  data: PutApiCrmServiceMerchantsByIdIndividualByIndividualIdNameByNameIdData,
) {
  try {
    const requests = await getApiRequests();
    const response = await requests[partyName].putIndividualName(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function putCrmIndividualPersonalSummaryApi(
  partyName: "merchants",
  data: PutApiCrmServiceMerchantsByIdIndividualByIndividualIdPersonalSummaryByPersonalSummaryIdData,
) {
  try {
    const requests = await getApiRequests();
    const response =
      await requests[partyName].putIndividualPersonalSummary(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function putAffiliationsApi(
  data: PutApiCrmServiceAffiliationCodesByIdData,
) {
  try {
    const crmClient = await getCRMServiceClient();
    const response =
      await crmClient.affiliationCode.putApiCrmServiceAffiliationCodesById(
        data,
      );
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
