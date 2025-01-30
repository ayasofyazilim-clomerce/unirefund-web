"use server";

import type {
  PutApiCrmServiceAffiliationCodesByIdData,
  PutApiCrmServiceCustomsByIdData,
  PutApiCrmServiceCustomsByIdOrganizationsByOrganizationIdData,
  PutApiCrmServiceMerchantsByIdAddressesByAddressIdData,
  PutApiCrmServiceMerchantsByIdData,
  PutApiCrmServiceMerchantsByIdEmailsByEmailIdData,
  PutApiCrmServiceMerchantsByIdIndividualByIndividualIdNameByNameIdData,
  PutApiCrmServiceMerchantsByIdIndividualByIndividualIdPersonalSummaryByPersonalSummaryIdData,
  PutApiCrmServiceMerchantsByIdOrganizationsByOrganizationIdData,
  PutApiCrmServiceMerchantsByIdTelephonesByTelephoneIdData,
  PutApiCrmServiceRefundPointsByIdData,
  PutApiCrmServiceRefundPointsByIdEmailsByEmailIdData,
  PutApiCrmServiceRefundPointsByIdOrganizationsByOrganizationIdData,
  PutApiCrmServiceRefundPointsByIdTelephonesByTelephoneIdData,
  PutApiCrmServiceTaxFreesByIdData,
  PutApiCrmServiceTaxFreesByIdOrganizationsByOrganizationIdData,
  PutApiCrmServiceTaxOfficesByIdData,
  PutApiCrmServiceTaxOfficesByIdOrganizationsByOrganizationIdData,
} from "@ayasofyazilim/saas/CRMService";
import type { Session } from "@repo/utils/auth";
import {
  getCRMServiceClient,
  structuredError,
  structuredResponse,
  structuredSuccessResponse,
} from "src/lib";
import { getApiRequests } from "../../api-requests";

export async function putMerchantBaseApi(
  data: PutApiCrmServiceMerchantsByIdData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response =
      await crmClient.merchant.putApiCrmServiceMerchantsById(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putRefundPointBaseApi(
  data: PutApiCrmServiceRefundPointsByIdData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response =
      await crmClient.refundPoint.putApiCrmServiceRefundPointsById(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putCustomBaseApi(
  data: PutApiCrmServiceCustomsByIdData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.customs.putApiCrmServiceCustomsById(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putTaxFreeBaseApi(
  data: PutApiCrmServiceTaxFreesByIdData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxFree.putApiCrmServiceTaxFreesById(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putTaxOfficeBaseApi(
  data: PutApiCrmServiceTaxOfficesByIdData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response =
      await crmClient.taxOffice.putApiCrmServiceTaxOfficesById(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putMerchantOrganizationApi(
  data: PutApiCrmServiceMerchantsByIdOrganizationsByOrganizationIdData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response =
      await crmClient.merchant.putApiCrmServiceMerchantsByIdOrganizationsByOrganizationId(
        data,
      );
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putRefundPointOrganizationApi(
  data: PutApiCrmServiceRefundPointsByIdOrganizationsByOrganizationIdData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response =
      await crmClient.refundPoint.putApiCrmServiceRefundPointsByIdOrganizationsByOrganizationId(
        data,
      );
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putCustomOrganizationApi(
  data: PutApiCrmServiceCustomsByIdOrganizationsByOrganizationIdData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response =
      await crmClient.customs.putApiCrmServiceCustomsByIdOrganizationsByOrganizationId(
        data,
      );
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putTaxFreeOrganizationApi(
  data: PutApiCrmServiceTaxFreesByIdOrganizationsByOrganizationIdData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response =
      await crmClient.taxFree.putApiCrmServiceTaxFreesByIdOrganizationsByOrganizationId(
        data,
      );
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putTaxOfficeOrganizationApi(
  data: PutApiCrmServiceTaxOfficesByIdOrganizationsByOrganizationIdData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response =
      await crmClient.taxOffice.putApiCrmServiceTaxOfficesByIdOrganizationsByOrganizationId(
        data,
      );
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
//Unupdated

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
    return structuredError(error);
  }
}
export async function putRefundPointEmailApi(
  data: PutApiCrmServiceRefundPointsByIdEmailsByEmailIdData,
) {
  try {
    const crmClient = await getCRMServiceClient();
    const response =
      await crmClient.refundPoint.putApiCrmServiceRefundPointsByIdEmailsByEmailId(
        data,
      );
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
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
    return structuredError(error);
  }
}
export async function putRefundPointAddressApi(
  data: PutApiCrmServiceMerchantsByIdAddressesByAddressIdData,
) {
  try {
    const crmClient = await getCRMServiceClient();
    const response =
      await crmClient.refundPoint.putApiCrmServiceRefundPointsByIdAddressesByAddressId(
        data,
      );
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
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
    return structuredError(error);
  }
}
export async function putRefundPointTelephoneApi(
  data: PutApiCrmServiceRefundPointsByIdTelephonesByTelephoneIdData,
) {
  try {
    const crmClient = await getCRMServiceClient();
    const response =
      await crmClient.refundPoint.putApiCrmServiceRefundPointsByIdTelephonesByTelephoneId(
        data,
      );
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

//unupdated
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
