"use server";
import {
  GetApiCrmServiceCustomsByIdAffiliationsData,
  GetApiCrmServiceCustomsData,
  GetApiCrmServiceIndividualsData,
  GetApiCrmServiceMerchantsByIdAffiliationsData,
  GetApiCrmServiceMerchantsData,
  GetApiCrmServiceRefundPointsByIdAffiliationsData,
  GetApiCrmServiceRefundPointsData,
  GetApiCrmServiceTaxFreesByIdAffiliationsData,
  GetApiCrmServiceTaxFreesData,
  GetApiCrmServiceTaxOfficesByIdAffiliationsData,
  GetApiCrmServiceTaxOfficesData
} from "@repo/saas/CRMService";
import { structuredError, structuredSuccessResponse } from "@repo/utils/api";
import type { Session } from "@repo/utils/auth";
import { getCRMServiceClient } from "../lib";
/* Merchant */
export async function getMerchantsApi(data: GetApiCrmServiceMerchantsData = {}, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.merchant.getApiCrmServiceMerchants(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getMerchantByIdApi(merchantId: string, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.merchant.getApiCrmServiceMerchantsById({ id: merchantId });
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getMerchantEmailsByIdApi(merchantId: string, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.merchant.getApiCrmServiceMerchantsByIdEmails({ id: merchantId });
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getMerchantTelephonesByIdApi(merchantId: string, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.merchant.getApiCrmServiceMerchantsByIdTelephones({ id: merchantId });
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getMerchantAddressesByIdApi(merchantId: string, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.merchant.getApiCrmServiceMerchantsByIdAddresses({ id: merchantId });
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getMerchantAffiliationsByIdApi(
  data: GetApiCrmServiceMerchantsByIdAffiliationsData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.merchant.getApiCrmServiceMerchantsByIdAffiliations(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getMerchantProductGroupByIdApi(merchantId: string, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.merchant.getApiCrmServiceMerchantsByIdProductGroup({ id: merchantId });
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}

/* RefundPoint */
export async function getRefundPointsApi(data: GetApiCrmServiceRefundPointsData = {}, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.refundPoint.getApiCrmServiceRefundPoints(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getRefundPointByIdApi(refundPointId: string, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.refundPoint.getApiCrmServiceRefundPointsById({ id: refundPointId });
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getRefundPointEmailsByIdApi(refundPointId: string, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.refundPoint.getApiCrmServiceRefundPointsByIdEmails({ id: refundPointId });
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getRefundPointTelephonesByIdApi(refundPointId: string, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.refundPoint.getApiCrmServiceRefundPointsByIdTelephones({ id: refundPointId });
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getRefundPointAddressesByIdApi(refundPointId: string, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.refundPoint.getApiCrmServiceRefundPointsByIdAddresses({ id: refundPointId });
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getRefundPointAffiliationsByIdApi(
  data: GetApiCrmServiceRefundPointsByIdAffiliationsData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.refundPoint.getApiCrmServiceRefundPointsByIdAffiliations(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
/* TaxFree */
export async function getTaxFreesApi(data: GetApiCrmServiceTaxFreesData = {}, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxFree.getApiCrmServiceTaxFrees(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getTaxFreeByIdApi(taxFreeId: string, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxFree.getApiCrmServiceTaxFreesById({ id: taxFreeId });
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getTaxFreeEmailsByIdApi(taxFreeId: string, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxFree.getApiCrmServiceTaxFreesByIdEmails({ id: taxFreeId });
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getTaxFreeAffiliationsByIdApi(
  data: GetApiCrmServiceTaxFreesByIdAffiliationsData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxFree.getApiCrmServiceTaxFreesByIdAffiliations(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getTaxFreeTelephonesByIdApi(taxFreeId: string, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxFree.getApiCrmServiceTaxFreesByIdTelephones({ id: taxFreeId });
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getTaxFreeAddressesByIdApi(taxFreeId: string, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxFree.getApiCrmServiceTaxFreesByIdAddresses({ id: taxFreeId });
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getTaxFreeAffiliationApi(
  data: GetApiCrmServiceTaxFreesByIdAffiliationsData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxFree.getApiCrmServiceTaxFreesByIdAffiliations(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
/* Custom */
export async function getCustomsApi(data: GetApiCrmServiceCustomsData = {}, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.custom.getApiCrmServiceCustoms(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getCustomByIdApi(customId: string, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.custom.getApiCrmServiceCustomsById({ id: customId });
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getCustomEmailsByIdApi(customId: string, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.custom.getApiCrmServiceCustomsByIdEmails({ id: customId });
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getCustomTelephonesByIdApi(customId: string, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.custom.getApiCrmServiceCustomsByIdTelephones({ id: customId });
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getCustomAddressesByIdApi(customId: string, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.custom.getApiCrmServiceCustomsByIdAddresses({ id: customId });
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getCustomAffiliationsByIdApi(
  data: GetApiCrmServiceCustomsByIdAffiliationsData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.custom.getApiCrmServiceCustomsByIdAffiliations(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
/* TaxOffice */
export async function getTaxOfficesApi(data: GetApiCrmServiceTaxOfficesData = {}, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxOffice.getApiCrmServiceTaxOffices(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getTaxOfficeByIdApi(taxOfficeId: string, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxOffice.getApiCrmServiceTaxOfficesById({ id: taxOfficeId });
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getTaxOfficeEmailsByIdApi(taxOfficeId: string, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxOffice.getApiCrmServiceTaxOfficesByIdEmails({ id: taxOfficeId });
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getTaxOfficeTelephonesByIdApi(taxOfficeId: string, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxOffice.getApiCrmServiceTaxOfficesByIdTelephones({ id: taxOfficeId });
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getTaxOfficeAddressesByIdApi(taxOfficeId: string, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxOffice.getApiCrmServiceTaxOfficesByIdAddresses({ id: taxOfficeId });
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getTaxOfficeAffiliationsByIdApi(
  data: GetApiCrmServiceTaxOfficesByIdAffiliationsData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxOffice.getApiCrmServiceTaxOfficesByIdAffiliations(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
/*Individuals */
export async function getIndividualsApi(data: GetApiCrmServiceIndividualsData = {}, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.individual.getApiCrmServiceIndividuals(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getIndividualByIdApi(individualId: string, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.individual.getApiCrmServiceIndividualsById({ id: individualId });
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getIndividualByEmailApi(email: string, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.individual.getApiCrmServiceIndividualsByEmail({ email });
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getIndividualEmailsByIdApi(individualId: string, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.individual.getApiCrmServiceIndividualsByIdEmails({ id: individualId });
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getIndividualTelephonesByIdApi(individualId: string, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.individual.getApiCrmServiceIndividualsByIdTelephones({ id: individualId });
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getIndividualAddressesByIdApi(individualId: string, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.individual.getApiCrmServiceIndividualsByIdAddresses({ id: individualId });
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
/* Address */

export async function getCountriesApi(session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.country.getApiCrmServiceCountries();
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getAdminAreaLevel1ByCountryIdApi(countryId: string, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.adminAreaLevel1.getApiCrmServiceAdminAreaLevel1ByCountryByCountryId({ countryId });
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function getAdminAreaLevel2ByAdminAreaLevel1IdApi(adminAreaLevel1Id: string, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response =
      await crmClient.adminAreaLevel2.getApiCrmServiceAdminAreaLevel2ByAdminAreaLevel1ByAdminAreaLevel1Id({
        adminAreaLevel1Id,
      });
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function getNeighborhoodsByAdminAreaLevel2IdApi(adminAreaLevel2Id: string, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.neighborhood.getApiCrmServiceNeighborhoodsByAdminAreaLevel2ByAdminAreaLevel2Id({
      adminAreaLevel2Id,
    });
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}





export async function getUserAffiliationsApi(session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.userAffiliation.getApiCrmServiceUserAffiliations();
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
