"use server";
import {
  GetApiCrmServiceCustomsByCustomIdAffiliationsData,
  GetApiCrmServiceCustomsData,
  GetApiCrmServiceIndividualsData,
  GetApiCrmServiceMerchantsByMerchantIdAffiliationsData,
  GetApiCrmServiceMerchantsData,
  GetApiCrmServiceRefundpointsByRefundPointIdAffiliationsData,
  GetApiCrmServiceRefundpointsData,
  GetApiCrmServiceTaxfreesByTaxFreeIdAffiliationsData,
  GetApiCrmServiceTaxfreesData,
  GetApiCrmServiceTaxofficesByTaxOfficeIdAffiliationsData,
  GetApiCrmServiceTaxofficesData,
  PostApiCrmServiceCustomsByCustomIdAffiliationsData,
  PostApiCrmServiceMerchantsByMerchantIdAffiliationsData,
  PostApiCrmServiceRefundpointsByRefundPointIdAffiliationsData,
  PostApiCrmServiceTaxfreesByTaxFreeIdAffiliationsData,
  PostApiCrmServiceTaxofficesByTaxOfficeIdAffiliationsData,
} from "@repo/saas/CRMService";
import {structuredError, structuredSuccessResponse} from "@repo/utils/api";
import type {Session} from "@repo/utils/auth";
import {getCRMServiceClient} from "../lib";
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
    const response = await crmClient.merchant.getApiCrmServiceMerchantsByMerchantId({merchantId});
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getMerchantEmailsByMerchantIdApi(merchantId: string, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.merchant.getApiCrmServiceMerchantsByMerchantIdEmails({merchantId});
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getMerchantTelephonesByMerchantIdApi(merchantId: string, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.merchant.getApiCrmServiceMerchantsByMerchantIdTelephones({merchantId});
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getMerchantAddressesByMerchantIdApi(merchantId: string, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.merchant.getApiCrmServiceMerchantsByMerchantIdAddresses({merchantId});
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getMerchantAffiliationsByMerchantIdApi(
  data: GetApiCrmServiceMerchantsByMerchantIdAffiliationsData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.merchant.getApiCrmServiceMerchantsByMerchantIdAffiliations(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getMerchantProductGroupByMerchantIdApi(merchantId: string, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.merchant.getApiCrmServiceMerchantsByMerchantIdProductGroup({merchantId});
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function postMerchantAffiliationApi(
  data: PostApiCrmServiceMerchantsByMerchantIdAffiliationsData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.merchant.postApiCrmServiceMerchantsByMerchantIdAffiliations(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
/* RefundPoint */
export async function getRefundPointsApi(data: GetApiCrmServiceRefundpointsData = {}, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.refundPoint.getApiCrmServiceRefundpoints(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getRefundPointByIdApi(refundPointId: string, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.refundPoint.getApiCrmServiceRefundpointsByRefundPointId({refundPointId});
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getRefundPointEmailsByRefundPointIdApi(refundPointId: string, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.refundPoint.getApiCrmServiceRefundpointsByRefundPointIdEmails({refundPointId});
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getRefundPointTelephonesByRefundPointIdApi(refundPointId: string, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.refundPoint.getApiCrmServiceRefundpointsByRefundPointIdTelephones({refundPointId});
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getRefundPointAddressesByRefundPointIdApi(refundPointId: string, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.refundPoint.getApiCrmServiceRefundpointsByRefundPointIdAddresses({refundPointId});
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getRefundPointAffiliationsByRefundPointIdApi(
  data: GetApiCrmServiceRefundpointsByRefundPointIdAffiliationsData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.refundPoint.getApiCrmServiceRefundpointsByRefundPointIdAffiliations(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function postRefundPointAffiliationApi(
  data: PostApiCrmServiceRefundpointsByRefundPointIdAffiliationsData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.refundPoint.postApiCrmServiceRefundpointsByRefundPointIdAffiliations(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
/* TaxFree */
export async function getTaxFreesApi(data: GetApiCrmServiceTaxfreesData = {}, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxFree.getApiCrmServiceTaxfrees(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getTaxFreeByIdApi(taxFreeId: string, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxFree.getApiCrmServiceTaxfreesByTaxFreeId({taxFreeId});
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getTaxFreeEmailsByTaxFreeIdApi(taxFreeId: string, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxFree.getApiCrmServiceTaxfreesByTaxFreeIdEmails({taxFreeId});
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getTaxFreeAffiliationsByTaxFreeIdApi(
  data: GetApiCrmServiceTaxfreesByTaxFreeIdAffiliationsData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxFree.getApiCrmServiceTaxfreesByTaxFreeIdAffiliations(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getTaxFreeTelephonesByTaxFreeIdApi(taxFreeId: string, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxFree.getApiCrmServiceTaxfreesByTaxFreeIdTelephones({taxFreeId});
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getTaxFreeAddressesByTaxFreeIdApi(taxFreeId: string, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxFree.getApiCrmServiceTaxfreesByTaxFreeIdAddresses({taxFreeId});
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getTaxFreeAffiliationApi(
  data: GetApiCrmServiceTaxfreesByTaxFreeIdAffiliationsData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxFree.getApiCrmServiceTaxfreesByTaxFreeIdAffiliations(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function postTaxFreeAffiliationApi(
  data: PostApiCrmServiceTaxfreesByTaxFreeIdAffiliationsData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxFree.postApiCrmServiceTaxfreesByTaxFreeIdAffiliations(data);
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
    const response = await crmClient.custom.getApiCrmServiceCustomsByCustomId({customId});
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getCustomEmailsByCustomIdApi(customId: string, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.custom.getApiCrmServiceCustomsByCustomIdEmails({customId});
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getCustomTelephonesByCustomIdApi(customId: string, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.custom.getApiCrmServiceCustomsByCustomIdTelephones({customId});
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getCustomAddressesByCustomIdApi(customId: string, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.custom.getApiCrmServiceCustomsByCustomIdAddresses({customId});
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getCustomAffiliationsByCustomIdApi(
  data: GetApiCrmServiceCustomsByCustomIdAffiliationsData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.custom.getApiCrmServiceCustomsByCustomIdAffiliations(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function postCustomAffiliationApi(
  data: PostApiCrmServiceCustomsByCustomIdAffiliationsData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.custom.postApiCrmServiceCustomsByCustomIdAffiliations(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
/* TaxOffice */
export async function getTaxOfficesApi(data: GetApiCrmServiceTaxofficesData = {}, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxOffice.getApiCrmServiceTaxoffices(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getTaxOfficeByIdApi(taxOfficeId: string, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxOffice.getApiCrmServiceTaxofficesByTaxOfficeId({taxOfficeId});
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getTaxOfficeEmailsByTaxOfficeIdApi(taxOfficeId: string, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxOffice.getApiCrmServiceTaxofficesByTaxOfficeIdEmails({taxOfficeId});
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getTaxOfficeTelephonesByTaxOfficeIdApi(taxOfficeId: string, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxOffice.getApiCrmServiceTaxofficesByTaxOfficeIdTelephones({taxOfficeId});
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getTaxOfficeAddressesByTaxOfficeIdApi(taxOfficeId: string, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxOffice.getApiCrmServiceTaxofficesByTaxOfficeIdAddresses({taxOfficeId});
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getTaxOfficeAffiliationsByTaxOfficeIdApi(
  data: GetApiCrmServiceTaxofficesByTaxOfficeIdAffiliationsData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxOffice.getApiCrmServiceTaxofficesByTaxOfficeIdAffiliations(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function postTaxOfficesAffiliationApi(
  data: PostApiCrmServiceTaxofficesByTaxOfficeIdAffiliationsData,
  session?: Session | null,
) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxOffice.postApiCrmServiceTaxofficesByTaxOfficeIdAffiliations(data);
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
    const response = await crmClient.individual.getApiCrmServiceIndividualsByIndividualId({individualId});
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getIndividualByEmailApi(email: string, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.individual.getApiCrmServiceIndividualsByEmail({email});
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getIndividualEmailsByIndividualIdApi(individualId: string, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.individual.getApiCrmServiceIndividualsByIndividualIdEmails({individualId});
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getIndividualTelephonesByIndividualIdApi(individualId: string, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.individual.getApiCrmServiceIndividualsByIndividualIdTelephones({individualId});
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getIndividualAddressesByIndividualIdApi(individualId: string, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.individual.getApiCrmServiceIndividualsByIndividualIdAddresses({individualId});
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
    const response = await crmClient.adminAreaLevel1.getApiCrmServiceAdminarealevel1ByCountryByCountryId({countryId});
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function getAdminAreaLevel2ByAdminAreaLevel1IdApi(adminAreaLevel1Id: string, session?: Session | null) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response =
      await crmClient.adminAreaLevel2.getApiCrmServiceAdminarealevel2ByAdminarealevel1ByAdminAreaLevel1Id({
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
    const response = await crmClient.neighborhood.getApiCrmServiceNeighborhoodsByAdminarealevel2ByAdminAreaLevel2Id({
      adminAreaLevel2Id,
    });
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
