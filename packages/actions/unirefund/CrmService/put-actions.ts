"use server";
import {
  PutApiCrmServiceCustomsByCustomIdAffiliationsByAffiliationIdData,
  PutApiCrmServiceCustomsByIdAddressesData,
  PutApiCrmServiceCustomsByIdData,
  PutApiCrmServiceCustomsByIdEmailsData,
  PutApiCrmServiceCustomsByIdTelephonesData,
  PutApiCrmServiceIndividualsByIdAddressesData,
  PutApiCrmServiceIndividualsByIdData,
  PutApiCrmServiceIndividualsByIdEmailsData,
  PutApiCrmServiceIndividualsByIdTelephonesData,
  PutApiCrmServiceMerchantsByIdAddressesData,
  PutApiCrmServiceMerchantsByIdData,
  PutApiCrmServiceMerchantsByIdEmailsData,
  PutApiCrmServiceMerchantsByIdTelephonesData,
  PutApiCrmServiceMerchantsByMerchantIdAffiliationsByAffiliationIdData,
  PutApiCrmServiceRefundPointsByIdAddressesData,
  PutApiCrmServiceRefundPointsByIdData,
  PutApiCrmServiceRefundPointsByIdEmailsData,
  PutApiCrmServiceRefundPointsByIdTelephonesData,
  PutApiCrmServiceRefundPointsByRefundPointIdAffiliationsByAffiliationIdData,
  PutApiCrmServiceTaxFreesByIdAddressesData,
  PutApiCrmServiceTaxFreesByIdData,
  PutApiCrmServiceTaxFreesByIdEmailsData,
  PutApiCrmServiceTaxFreesByIdTelephonesData,
  PutApiCrmServiceTaxFreesByTaxFreeIdAffiliationsByAffiliationIdData,
  PutApiCrmServiceTaxOfficesByIdAddressesData,
  PutApiCrmServiceTaxOfficesByIdData,
  PutApiCrmServiceTaxOfficesByIdEmailsData,
  PutApiCrmServiceTaxOfficesByIdTelephonesData,
  PutApiCrmServiceTaxOfficesByTaxOfficeIdAffiliationsByAffiliationIdData
} from "@repo/saas/CRMService";
import { structuredError, structuredSuccessResponse } from "@repo/utils/api";
import type { Session } from "@repo/utils/auth";
import { getCRMServiceClient } from "../lib";
/* Merchant */
export async function putMerchantByIdApi(data: PutApiCrmServiceMerchantsByIdData, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.merchant.putApiCrmServiceMerchantsById(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putMerchantEmailsByIdApi(
  data: PutApiCrmServiceMerchantsByIdEmailsData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.merchant.putApiCrmServiceMerchantsByIdEmails(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putMerchantTelephonesByIdApi(
  data: PutApiCrmServiceMerchantsByIdTelephonesData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.merchant.putApiCrmServiceMerchantsByIdTelephones(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putMerchantAddressesByIdApi(
  data: PutApiCrmServiceMerchantsByIdAddressesData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.merchant.putApiCrmServiceMerchantsByIdAddresses(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putMerchantAffiliationByIdApi(
  data: PutApiCrmServiceMerchantsByMerchantIdAffiliationsByAffiliationIdData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.merchant.putApiCrmServiceMerchantsByMerchantIdAffiliationsByAffiliationId(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

/* RefundPoint */
export async function putRefundPointByIdApi(
  data: PutApiCrmServiceRefundPointsByIdData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.refundPoint.putApiCrmServiceRefundPointsById(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putRefundPointEmailsByIdApi(
  data: PutApiCrmServiceRefundPointsByIdEmailsData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.refundPoint.putApiCrmServiceRefundPointsByIdEmails(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putRefundPointTelephonesByIdApi(
  data: PutApiCrmServiceRefundPointsByIdTelephonesData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.refundPoint.putApiCrmServiceRefundPointsByIdTelephones(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putRefundPointAddressesByIdApi(
  data: PutApiCrmServiceRefundPointsByIdAddressesData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.refundPoint.putApiCrmServiceRefundPointsByIdAddresses(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putRefundPointAffiliationByIdApi(
  data: PutApiCrmServiceRefundPointsByRefundPointIdAffiliationsByAffiliationIdData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response =
      await crmClient.refundPoint.putApiCrmServiceRefundPointsByRefundPointIdAffiliationsByAffiliationId(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

/* TaxFree */
export async function putTaxFreeByIdApi(data: PutApiCrmServiceTaxFreesByIdData, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxFree.putApiCrmServiceTaxFreesById(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putTaxFreeEmailsByIdApi(
  data: PutApiCrmServiceTaxFreesByIdEmailsData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxFree.putApiCrmServiceTaxFreesByIdEmails(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putTaxFreeTelephonesByIdApi(
  data: PutApiCrmServiceTaxFreesByIdTelephonesData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxFree.putApiCrmServiceTaxFreesByIdTelephones(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putTaxFreeAddressesByIdApi(
  data: PutApiCrmServiceTaxFreesByIdAddressesData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxFree.putApiCrmServiceTaxFreesByIdAddresses(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putTaxFreeAffiliationByIdApi(
  data: PutApiCrmServiceTaxFreesByTaxFreeIdAffiliationsByAffiliationIdData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxFree.putApiCrmServiceTaxFreesByTaxFreeIdAffiliationsByAffiliationId(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
/* Custom */
export async function putCustomByIdApi(data: PutApiCrmServiceCustomsByIdData, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.custom.putApiCrmServiceCustomsById(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putCustomEmailsByIdApi(
  data: PutApiCrmServiceCustomsByIdEmailsData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.custom.putApiCrmServiceCustomsByIdEmails(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putCustomTelephonesByIdApi(
  data: PutApiCrmServiceCustomsByIdTelephonesData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.custom.putApiCrmServiceCustomsByIdTelephones(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putCustomAddressesByIdApi(
  data: PutApiCrmServiceCustomsByIdAddressesData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.custom.putApiCrmServiceCustomsByIdAddresses(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putCustomAffiliationByIdApi(
  data: PutApiCrmServiceCustomsByCustomIdAffiliationsByAffiliationIdData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.custom.putApiCrmServiceCustomsByCustomIdAffiliationsByAffiliationId(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
/* TaxOffice */
export async function putTaxOfficeByIdApi(data: PutApiCrmServiceTaxOfficesByIdData, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxOffice.putApiCrmServiceTaxOfficesById(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putTaxOfficeEmailsByIdApi(
  data: PutApiCrmServiceTaxOfficesByIdEmailsData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxOffice.putApiCrmServiceTaxOfficesByIdEmails(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putTaxOfficeTelephonesByIdApi(
  data: PutApiCrmServiceTaxOfficesByIdTelephonesData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxOffice.putApiCrmServiceTaxOfficesByIdTelephones(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putTaxOfficeAddressesByIdApi(
  data: PutApiCrmServiceTaxOfficesByIdAddressesData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxOffice.putApiCrmServiceTaxOfficesByIdAddresses(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putTaxOfficeAffiliationByIdApi(
  data: PutApiCrmServiceTaxOfficesByTaxOfficeIdAffiliationsByAffiliationIdData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxOffice.putApiCrmServiceTaxOfficesByTaxOfficeIdAffiliationsByAffiliationId(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

/* Individual */
export async function putIndividualByIdApi(
  data: PutApiCrmServiceIndividualsByIdData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.individual.putApiCrmServiceIndividualsById(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putIndividualEmailsByIdApi(
  data: PutApiCrmServiceIndividualsByIdEmailsData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.individual.putApiCrmServiceIndividualsByIdEmails(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putIndividualTelephonesByIdApi(
  data: PutApiCrmServiceIndividualsByIdTelephonesData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.individual.putApiCrmServiceIndividualsByIdTelephones(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putIndividualAddressesByIdApi(
  data: PutApiCrmServiceIndividualsByIdAddressesData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.individual.putApiCrmServiceIndividualsByIdAddresses(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
