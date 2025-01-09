"use server";
import type {
  GetApiSaasEditionsData,
  GetApiSaasTenantsData,
  PutApiSaasTenantsByIdSetPasswordData,
} from "@ayasofyazilim/saas/SaasService";
import {
  getSaasServiceClient,
  structuredError,
  structuredResponse,
} from "src/lib";

export async function getEditionsApi(data: GetApiSaasEditionsData) {
  try {
    const client = await getSaasServiceClient();
    const dataResponse = await client.edition.getApiSaasEditions(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getEditionDetailsByIdApi(id: string) {
  try {
    const client = await getSaasServiceClient();
    const dataResponse = await client.edition.getApiSaasEditionsById({
      id,
    });
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getAllEditionsApi() {
  try {
    const client = await getSaasServiceClient();
    const dataResponse = await client.edition.getApiSaasEditionsAll();
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getTenantsApi(data: GetApiSaasTenantsData) {
  try {
    const client = await getSaasServiceClient();
    const dataResponse = await client.tenant.getApiSaasTenants(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getTenantDetailsByIdApi(id: string) {
  try {
    const client = await getSaasServiceClient();
    const dataResponse = await client.tenant.getApiSaasTenantsById({ id });
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function putTenantsByIdChangePasswordApi(
  data: PutApiSaasTenantsByIdSetPasswordData,
) {
  try {
    const client = await getSaasServiceClient();
    const dataResponse =
      await client.tenant.putApiSaasTenantsByIdSetPassword(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getTenantsLookupEditionsApi() {
  try {
    const client = await getSaasServiceClient();
    const dataResponse = await client.tenant.getApiSaasTenantsLookupEditions();
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
