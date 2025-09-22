"use server";
import { structuredError, structuredSuccessResponse } from "@repo/utils/api";
import type { Session } from "@repo/utils/auth";
import { getCRMServiceClient } from "../lib";

/*Merchant */
export async function deleteMerchantByIdApi({
  merchantId,
  session,
}: {
  merchantId: string;
  session?: Session | null;
}) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.merchant.deleteApiCrmServiceMerchantsById({
      id: merchantId,
    });
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function deleteMerchantAffiliationByIdApi({
  merchantId,
  affiliationId,
  session,
}: {
  merchantId: string;
  affiliationId: string;
  session?: Session | null;
}) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.merchant.deleteApiCrmServiceMerchantsByMerchantIdAffiliationsByAffiliationId({
      merchantId,
      affiliationId,
    });
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function deleteMerchantProductGroupsByIdApi({
  merchantId,
  productGroupIds,
  session,
}: {
  merchantId: string;
  productGroupIds: string[];
  session?: Session | null;
}) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.merchant.deleteApiCrmServiceMerchantsByIdProductGroups({
      id: merchantId,
      requestBody: productGroupIds,
    });
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
/*RefundPoint */
export async function deleteRefundPointByRefundPointIdApi({
  refundPointId,
  session,
}: {
  refundPointId: string;
  session?: Session | null;
}) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.refundPoint.deleteApiCrmServiceRefundPointsById({
      id: refundPointId,
    });
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function deleteRefundPointAffiliationByIdApi({
  refundPointId,
  affiliationId,
  session,
}: {
  refundPointId: string;
  affiliationId: string;
  session?: Session | null;
}) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response =
      await crmClient.refundPoint.deleteApiCrmServiceRefundPointsByRefundPointIdAffiliationsByAffiliationId({
        refundPointId,
        affiliationId,
      });
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
/*TaxOffice */
export async function deleteTaxOfficeByTaxOfficeIdApi({
  taxOfficeId,
  session,
}: {
  taxOfficeId: string;
  session?: Session | null;
}) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxOffice.deleteApiCrmServiceTaxOfficesById({
      id: taxOfficeId,
    });
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function deleteTaxOfficeAffiliationByIdApi({
  taxOfficeId,
  affiliationId,
  session,
}: {
  taxOfficeId: string;
  affiliationId: string;
  session?: Session | null;
}) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxOffice.deleteApiCrmServiceTaxOfficesByTaxOfficeIdAffiliationsByAffiliationId({
      taxOfficeId,
      affiliationId,
    });
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
/*TaxFree */
export async function deleteTaxFreeByTaxFreeIdApi({
  taxFreeId,
  session,
}: {
  taxFreeId: string;
  session?: Session | null;
}) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxFree.deleteApiCrmServiceTaxFreesById({
      id: taxFreeId,
    });
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function deleteTaxFreeAffiliationByIdApi({
  taxFreeId,
  affiliationId,
  session,
}: {
  taxFreeId: string;
  affiliationId: string;
  session?: Session | null;
}) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.taxFree.deleteApiCrmServiceTaxFreesByTaxFreeIdAffiliationsByAffiliationId({
      taxFreeId,
      affiliationId,
    });
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
/*Customs */
export async function deleteCustomByCustomIdApi({
  customId,
  session,
}: {
  customId: string;
  session?: Session | null;
}) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.custom.deleteApiCrmServiceCustomsById({
      id: customId,
    });
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function deleteCustomAffiliationByIdApi({
  customId,
  affiliationId,
  session,
}: {
  customId: string;
  affiliationId: string;
  session?: Session | null;
}) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.custom.deleteApiCrmServiceCustomsByCustomIdAffiliationsByAffiliationId({
      customId,
      affiliationId,
    });
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
/*Individual */
export async function deleteIndividualByIdApi({
  individualId,
  session,
}: {
  individualId: string;
  session?: Session | null;
}) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.individual.deleteApiCrmServiceIndividualsById({
      id: individualId,
    });
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}