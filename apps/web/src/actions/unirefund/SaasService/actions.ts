"use server";
import type {PutApiSaasEditionsByIdMoveAllTenantsData} from "@ayasofyazilim/saas/SaasService";
import {structuredError, structuredResponse} from "src/lib";
import {getApiRequests} from "../../api-requests";

export async function getAllEditionsApi() {
  try {
    const requests = await getApiRequests();
    const dataResponse = await requests.editions.getAllEditions();
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function moveAllTenantsApi(data: PutApiSaasEditionsByIdMoveAllTenantsData) {
  try {
    const requests = await getApiRequests();
    const dataResponse = await requests.editions.moveAllTenants(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
