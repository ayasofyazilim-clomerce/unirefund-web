"use server";

import type {
  PutApiCrmServiceAffiliationCodesByIdData,
  PutApiCrmServiceCustomsByIdData,
  PutApiCrmServiceCustomsByIdOrganizationsByOrganizationIdData,
  PutApiCrmServiceIndividualsByIdAddressByAddressIdData,
  PutApiCrmServiceIndividualsByIdEmailByEmailIdData,
  PutApiCrmServiceIndividualsByIdNameData,
  PutApiCrmServiceIndividualsByIdPersonalSummaryByPersonalSummaryIdData,
  PutApiCrmServiceIndividualsByIdTelephoneByTelephoneIdData,
  PutApiCrmServiceMerchantsByIdAddressesByAddressIdData,
  PutApiCrmServiceMerchantsByIdData,
  PutApiCrmServiceMerchantsByIdEmailsByEmailIdData,
  PutApiCrmServiceMerchantsByIdOrganizationsByOrganizationIdData,
  PutApiCrmServiceMerchantsByIdTelephonesByTelephoneIdData,
  PutApiCrmServiceRefundPointsByIdData,
  PutApiCrmServiceRefundPointsByIdEmailsByEmailIdData,
  PutApiCrmServiceRefundPointsByIdOrganizationsByOrganizationIdData,
  PutApiCrmServiceRefundPointsByIdTelephonesByTelephoneIdData,
  PutApiCrmServiceTaxFreesByIdData,
  PutApiCrmServiceTaxFreesByIdEmailsByEmailIdData,
  PutApiCrmServiceTaxFreesByIdOrganizationsByOrganizationIdData,
  PutApiCrmServiceTaxOfficesByIdData,
  PutApiCrmServiceTaxOfficesByIdEmailsByEmailIdData,
  PutApiCrmServiceTaxOfficesByIdOrganizationsByOrganizationIdData,
} from "@ayasofyazilim/saas/CRMService";
import {structuredError, structuredResponse, structuredSuccessResponse} from "@repo/utils/api";
import type {Session} from "@repo/utils/auth";
import {getCRMServiceClient} from "../lib";

export async function putMerchantBaseApi(data: PutApiCrmServiceMerchantsByIdData, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.merchant.putApiCrmServiceMerchantsById(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putRefundPointBaseApi(data: PutApiCrmServiceRefundPointsByIdData, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.refundPoint.putApiCrmServiceRefundPointsById(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putCustomBaseApi(data: PutApiCrmServiceCustomsByIdData, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.customs.putApiCrmServiceCustomsById(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putTaxFreeBaseApi(data: PutApiCrmServiceTaxFreesByIdData, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxFree.putApiCrmServiceTaxFreesById(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putTaxOfficeBaseApi(data: PutApiCrmServiceTaxOfficesByIdData, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxOffice.putApiCrmServiceTaxOfficesById(data);
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
    const response = await crmClient.merchant.putApiCrmServiceMerchantsByIdOrganizationsByOrganizationId(data);
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
    const response = await crmClient.refundPoint.putApiCrmServiceRefundPointsByIdOrganizationsByOrganizationId(data);
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
    const response = await crmClient.customs.putApiCrmServiceCustomsByIdOrganizationsByOrganizationId(data);
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
    const response = await crmClient.taxFree.putApiCrmServiceTaxFreesByIdOrganizationsByOrganizationId(data);
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
    const response = await crmClient.taxOffice.putApiCrmServiceTaxOfficesByIdOrganizationsByOrganizationId(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putIndividualNameApi(data: PutApiCrmServiceIndividualsByIdNameData, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.individual.putApiCrmServiceIndividualsByIdName(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putIndividualPersonalSummaryApi(
  data: PutApiCrmServiceIndividualsByIdPersonalSummaryByPersonalSummaryIdData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.individual.putApiCrmServiceIndividualsByIdPersonalSummaryByPersonalSummaryId(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
//Unupdated

export async function putMerchantEmailApi(data: PutApiCrmServiceMerchantsByIdEmailsByEmailIdData) {
  try {
    const crmClient = await getCRMServiceClient();
    const response = await crmClient.merchant.putApiCrmServiceMerchantsByIdEmailsByEmailId(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putRefundPointEmailApi(data: PutApiCrmServiceRefundPointsByIdEmailsByEmailIdData) {
  try {
    const crmClient = await getCRMServiceClient();
    const response = await crmClient.refundPoint.putApiCrmServiceRefundPointsByIdEmailsByEmailId(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putCustomEmailApi(data: PutApiCrmServiceRefundPointsByIdEmailsByEmailIdData) {
  try {
    const crmClient = await getCRMServiceClient();
    const response = await crmClient.customs.putApiCrmServiceCustomsByIdEmailsByEmailId(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putTaxFreeEmailApi(data: PutApiCrmServiceTaxFreesByIdEmailsByEmailIdData) {
  try {
    const crmClient = await getCRMServiceClient();
    const response = await crmClient.taxFree.putApiCrmServiceTaxFreesByIdEmailsByEmailId(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putTaxOfficeEmailApi(data: PutApiCrmServiceTaxOfficesByIdEmailsByEmailIdData) {
  try {
    const crmClient = await getCRMServiceClient();
    const response = await crmClient.taxOffice.putApiCrmServiceTaxOfficesByIdEmailsByEmailId(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putIndividualEmailApi(data: PutApiCrmServiceIndividualsByIdEmailByEmailIdData) {
  try {
    const crmClient = await getCRMServiceClient();
    const response = await crmClient.individual.putApiCrmServiceIndividualsByIdEmailByEmailId(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putMerchantAddressApi(data: PutApiCrmServiceMerchantsByIdAddressesByAddressIdData) {
  try {
    const crmClient = await getCRMServiceClient();
    const response = await crmClient.merchant.putApiCrmServiceMerchantsByIdAddressesByAddressId(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putRefundPointAddressApi(data: PutApiCrmServiceMerchantsByIdAddressesByAddressIdData) {
  try {
    const crmClient = await getCRMServiceClient();
    const response = await crmClient.refundPoint.putApiCrmServiceRefundPointsByIdAddressesByAddressId(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putCustomAddressApi(data: PutApiCrmServiceMerchantsByIdAddressesByAddressIdData) {
  try {
    const crmClient = await getCRMServiceClient();
    const response = await crmClient.customs.putApiCrmServiceCustomsByIdAddressesByAddressId(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putTaxFreeAddressApi(data: PutApiCrmServiceMerchantsByIdAddressesByAddressIdData) {
  try {
    const crmClient = await getCRMServiceClient();
    const response = await crmClient.taxFree.putApiCrmServiceTaxFreesByIdAddressesByAddressId(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putTaxOfficeAddressApi(data: PutApiCrmServiceMerchantsByIdAddressesByAddressIdData) {
  try {
    const crmClient = await getCRMServiceClient();
    const response = await crmClient.taxOffice.putApiCrmServiceTaxOfficesByIdAddressesByAddressId(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putIndividualAddressApi(data: PutApiCrmServiceIndividualsByIdAddressByAddressIdData) {
  try {
    const crmClient = await getCRMServiceClient();
    const response = await crmClient.individual.putApiCrmServiceIndividualsByIdAddressByAddressId(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putMerchantTelephoneApi(data: PutApiCrmServiceMerchantsByIdTelephonesByTelephoneIdData) {
  try {
    const crmClient = await getCRMServiceClient();
    const response = await crmClient.merchant.putApiCrmServiceMerchantsByIdTelephonesByTelephoneId(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putRefundPointTelephoneApi(data: PutApiCrmServiceRefundPointsByIdTelephonesByTelephoneIdData) {
  try {
    const crmClient = await getCRMServiceClient();
    const response = await crmClient.refundPoint.putApiCrmServiceRefundPointsByIdTelephonesByTelephoneId(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putCustomTelephoneApi(data: PutApiCrmServiceRefundPointsByIdTelephonesByTelephoneIdData) {
  try {
    const crmClient = await getCRMServiceClient();
    const response = await crmClient.customs.putApiCrmServiceCustomsByIdTelephonesByTelephoneId(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putTaxFreeTelephoneApi(data: PutApiCrmServiceRefundPointsByIdTelephonesByTelephoneIdData) {
  try {
    const crmClient = await getCRMServiceClient();
    const response = await crmClient.taxFree.putApiCrmServiceTaxFreesByIdTelephonesByTelephoneId(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putTaxOfficeTelephoneApi(data: PutApiCrmServiceRefundPointsByIdTelephonesByTelephoneIdData) {
  try {
    const crmClient = await getCRMServiceClient();
    const response = await crmClient.taxOffice.putApiCrmServiceTaxOfficesByIdTelephonesByTelephoneId(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putIndividualTelephoneApi(data: PutApiCrmServiceIndividualsByIdTelephoneByTelephoneIdData) {
  try {
    const crmClient = await getCRMServiceClient();
    const response = await crmClient.individual.putApiCrmServiceIndividualsByIdTelephoneByTelephoneId(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putAffiliationCodesByIdApi(
  data: PutApiCrmServiceAffiliationCodesByIdData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.affiliationCode.putApiCrmServiceAffiliationCodesById(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
