"use server";
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
