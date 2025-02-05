"use server";
import type {PutApiSaasTenantsByIdSetPasswordData} from "@ayasofyazilim/saas/SaasService";
import {structuredError, structuredResponse} from "src/lib";
import {getApiRequests} from "../../api-requests";

export async function putTenantSetPasswordApi(data: PutApiSaasTenantsByIdSetPasswordData) {
  try {
    const requests = await getApiRequests();
    const dataResponse = await requests.tenants.putSetPassword(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
