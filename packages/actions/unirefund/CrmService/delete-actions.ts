"use server";
import {structuredError, structuredSuccessResponse} from "@repo/utils/api";
import type {Session} from "@repo/utils/auth";
import {getCRMServiceClient} from "../lib";

/*Merchant */
export async function deleteMerchantByMerchantIdApi({
  merchantId,
  session,
}: {
  merchantId: string;
  session?: Session | null;
}) {
  try {
    const crmClient = await getCRMServiceClient(session);
    const response = await crmClient.merchant.deleteApiCrmServiceMerchantsByMerchantId({
      merchantId,
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
export async function deleteMerchantProductGroupsByMerchantIdApi({
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
    const response = await crmClient.merchant.deleteApiCrmServiceMerchantsByMerchantIdProductGroups({
      merchantId,
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
    const response = await crmClient.refundPoint.deleteApiCrmServiceRefundpointsByRefundPointId({
      refundPointId,
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
      await crmClient.refundPoint.deleteApiCrmServiceRefundpointsByRefundPointIdAffiliationsByAffiliationId({
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
    const response = await crmClient.taxOffice.deleteApiCrmServiceTaxofficesByTaxOfficeId({
      taxOfficeId,
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
    const response = await crmClient.taxOffice.deleteApiCrmServiceTaxofficesByTaxOfficeIdAffiliationsByAffiliationId({
      taxOfficeId,
      affiliationId,
    });
    return structuredSuccessResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
