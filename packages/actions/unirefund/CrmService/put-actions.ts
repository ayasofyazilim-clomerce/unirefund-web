"use server";
import {
  PutApiCrmServiceCustomsByCustomIdAddressesData,
  PutApiCrmServiceCustomsByCustomIdAffiliationsByAffiliationIdData,
  PutApiCrmServiceCustomsByCustomIdData,
  PutApiCrmServiceCustomsByCustomIdEmailsData,
  PutApiCrmServiceCustomsByCustomIdTelephonesData,
  PutApiCrmServiceIndividualsByIndividualIdAddressesData,
  PutApiCrmServiceIndividualsByIndividualIdData,
  PutApiCrmServiceIndividualsByIndividualIdEmailsData,
  PutApiCrmServiceIndividualsByIndividualIdTelephonesData,
  PutApiCrmServiceMerchantsByMerchantIdAddressesData,
  PutApiCrmServiceMerchantsByMerchantIdAffiliationsByAffiliationIdData,
  PutApiCrmServiceMerchantsByMerchantIdData,
  PutApiCrmServiceMerchantsByMerchantIdEmailsData,
  PutApiCrmServiceMerchantsByMerchantIdTelephonesData,
  PutApiCrmServiceRefundpointsByRefundPointIdAddressesData,
  PutApiCrmServiceRefundpointsByRefundPointIdAffiliationsByAffiliationIdData,
  PutApiCrmServiceRefundpointsByRefundPointIdData,
  PutApiCrmServiceRefundpointsByRefundPointIdEmailsData,
  PutApiCrmServiceRefundpointsByRefundPointIdTelephonesData,
  PutApiCrmServiceTaxfreesByTaxFreeIdAddressesData,
  PutApiCrmServiceTaxfreesByTaxFreeIdAffiliationsByAffiliationIdData,
  PutApiCrmServiceTaxfreesByTaxFreeIdData,
  PutApiCrmServiceTaxfreesByTaxFreeIdEmailsData,
  PutApiCrmServiceTaxfreesByTaxFreeIdTelephonesData,
  PutApiCrmServiceTaxofficesByTaxOfficeIdAddressesData,
  PutApiCrmServiceTaxofficesByTaxOfficeIdAffiliationsByAffiliationIdData,
  PutApiCrmServiceTaxofficesByTaxOfficeIdData,
  PutApiCrmServiceTaxofficesByTaxOfficeIdEmailsData,
  PutApiCrmServiceTaxofficesByTaxOfficeIdTelephonesData,
} from "@repo/saas/CRMService";
import {structuredError, structuredSuccessResponse} from "@repo/utils/api";
import type {Session} from "@repo/utils/auth";
import {getCRMServiceClient} from "../lib";
/* Merchant */
export async function putMerchantByIdApi(data: PutApiCrmServiceMerchantsByMerchantIdData, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.merchant.putApiCrmServiceMerchantsByMerchantId(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putMerchantEmailsByMerchantIdApi(
  data: PutApiCrmServiceMerchantsByMerchantIdEmailsData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.merchant.putApiCrmServiceMerchantsByMerchantIdEmails(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putMerchantTelephonesByMerchantIdApi(
  data: PutApiCrmServiceMerchantsByMerchantIdTelephonesData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.merchant.putApiCrmServiceMerchantsByMerchantIdTelephones(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putMerchantAddressesByMerchantIdApi(
  data: PutApiCrmServiceMerchantsByMerchantIdAddressesData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.merchant.putApiCrmServiceMerchantsByMerchantIdAddresses(data);
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
  data: PutApiCrmServiceRefundpointsByRefundPointIdData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.refundPoint.putApiCrmServiceRefundpointsByRefundPointId(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putRefundPointEmailsByRefundPointIdApi(
  data: PutApiCrmServiceRefundpointsByRefundPointIdEmailsData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.refundPoint.putApiCrmServiceRefundpointsByRefundPointIdEmails(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putRefundPointTelephonesByRefundPointIdApi(
  data: PutApiCrmServiceRefundpointsByRefundPointIdTelephonesData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.refundPoint.putApiCrmServiceRefundpointsByRefundPointIdTelephones(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putRefundPointAddressesByRefundPointIdApi(
  data: PutApiCrmServiceRefundpointsByRefundPointIdAddressesData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.refundPoint.putApiCrmServiceRefundpointsByRefundPointIdAddresses(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putRefundPointAffiliationByIdApi(
  data: PutApiCrmServiceRefundpointsByRefundPointIdAffiliationsByAffiliationIdData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response =
      await crmClient.refundPoint.putApiCrmServiceRefundpointsByRefundPointIdAffiliationsByAffiliationId(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

/* TaxFree */
export async function putTaxFreeByIdApi(data: PutApiCrmServiceTaxfreesByTaxFreeIdData, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxFree.putApiCrmServiceTaxfreesByTaxFreeId(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putTaxFreeEmailsByTaxFreeIdApi(
  data: PutApiCrmServiceTaxfreesByTaxFreeIdEmailsData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxFree.putApiCrmServiceTaxfreesByTaxFreeIdEmails(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putTaxFreeTelephonesByTaxFreeIdApi(
  data: PutApiCrmServiceTaxfreesByTaxFreeIdTelephonesData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxFree.putApiCrmServiceTaxfreesByTaxFreeIdTelephones(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putTaxFreeAddressesByTaxFreeIdApi(
  data: PutApiCrmServiceTaxfreesByTaxFreeIdAddressesData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxFree.putApiCrmServiceTaxfreesByTaxFreeIdAddresses(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putTaxFreeAffiliationByIdApi(
  data: PutApiCrmServiceTaxfreesByTaxFreeIdAffiliationsByAffiliationIdData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxFree.putApiCrmServiceTaxfreesByTaxFreeIdAffiliationsByAffiliationId(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
/* Custom */
export async function putCustomByIdApi(data: PutApiCrmServiceCustomsByCustomIdData, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.custom.putApiCrmServiceCustomsByCustomId(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putCustomEmailsByCustomIdApi(
  data: PutApiCrmServiceCustomsByCustomIdEmailsData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.custom.putApiCrmServiceCustomsByCustomIdEmails(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putCustomTelephonesByCustomIdApi(
  data: PutApiCrmServiceCustomsByCustomIdTelephonesData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.custom.putApiCrmServiceCustomsByCustomIdTelephones(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putCustomAddressesByCustomIdApi(
  data: PutApiCrmServiceCustomsByCustomIdAddressesData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.custom.putApiCrmServiceCustomsByCustomIdAddresses(data);
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
export async function putTaxOfficeByIdApi(data: PutApiCrmServiceTaxofficesByTaxOfficeIdData, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxOffice.putApiCrmServiceTaxofficesByTaxOfficeId(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putTaxOfficeEmailsByTaxOfficeIdApi(
  data: PutApiCrmServiceTaxofficesByTaxOfficeIdEmailsData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxOffice.putApiCrmServiceTaxofficesByTaxOfficeIdEmails(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putTaxOfficeTelephonesByTaxOfficeIdApi(
  data: PutApiCrmServiceTaxofficesByTaxOfficeIdTelephonesData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxOffice.putApiCrmServiceTaxofficesByTaxOfficeIdTelephones(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putTaxOfficeAddressesByTaxOfficeIdApi(
  data: PutApiCrmServiceTaxofficesByTaxOfficeIdAddressesData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxOffice.putApiCrmServiceTaxofficesByTaxOfficeIdAddresses(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putTaxOfficeAffiliationByIdApi(
  data: PutApiCrmServiceTaxofficesByTaxOfficeIdAffiliationsByAffiliationIdData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxOffice.putApiCrmServiceTaxofficesByTaxOfficeIdAffiliationsByAffiliationId(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

/* Individual */
export async function putIndividualByIdApi(
  data: PutApiCrmServiceIndividualsByIndividualIdData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.individual.putApiCrmServiceIndividualsByIndividualId(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putIndividualEmailsByIndividualIdApi(
  data: PutApiCrmServiceIndividualsByIndividualIdEmailsData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.individual.putApiCrmServiceIndividualsByIndividualIdEmails(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putIndividualTelephonesByIndividualIdApi(
  data: PutApiCrmServiceIndividualsByIndividualIdTelephonesData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.individual.putApiCrmServiceIndividualsByIndividualIdTelephones(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putIndividualAddressesByIndividualIdApi(
  data: PutApiCrmServiceIndividualsByIndividualIdAddressesData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.individual.putApiCrmServiceIndividualsByIndividualIdAddresses(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
