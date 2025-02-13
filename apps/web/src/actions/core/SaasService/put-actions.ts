"use server";
import type {
  PutApiSaasEditionsByIdData,
  PutApiSaasEditionsByIdMoveAllTenantsData,
  PutApiSaasTenantsByIdData,
} from "@ayasofyazilim/core-saas/SaasService";
import {structuredError, structuredResponse} from "@repo/utils/api";
import {getSaasServiceClient} from "src/lib";

export async function putEditionApi(data: PutApiSaasEditionsByIdData) {
  try {
    const client = await getSaasServiceClient();
    const dataResponse = await client.edition.putApiSaasEditionsById(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function putEditionsByIdMoveAllTenantsApi(data: PutApiSaasEditionsByIdMoveAllTenantsData) {
  try {
    const client = await getSaasServiceClient();
    const dataResponse = await client.edition.putApiSaasEditionsByIdMoveAllTenants(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function putTenantApi(data: PutApiSaasTenantsByIdData) {
  try {
    const client = await getSaasServiceClient();
    const dataResponse = await client.tenant.putApiSaasTenantsById(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
