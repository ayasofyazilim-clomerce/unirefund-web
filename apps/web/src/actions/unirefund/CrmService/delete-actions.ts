"use server";
import type { DeleteApiCrmServiceMerchantsByIdProductGroupsData } from "@ayasofyazilim/saas/CRMService";
import {
  getCRMServiceClient,
  structuredError,
  structuredResponse,
} from "src/lib";

export async function deleteAffiliationCodeApi(id: number) {
  try {
    const crmClient = await getCRMServiceClient();
    const response =
      await crmClient.affiliationCode.deleteApiCrmServiceAffiliationCodesById({
        id,
      });
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function deleteMerchantsByIdProductGroupsApi(
  data: DeleteApiCrmServiceMerchantsByIdProductGroupsData,
) {
  try {
    const crmClient = await getCRMServiceClient();
    const response =
      await crmClient.merchant.deleteApiCrmServiceMerchantsByIdProductGroups(
        data,
      );
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
