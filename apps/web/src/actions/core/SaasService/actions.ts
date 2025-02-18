"use server";
import type {
  GetApiSaasEditionsData,
  GetApiSaasTenantsData,
  PutApiSaasTenantsByIdSetPasswordData,
} from "@ayasofyazilim/core-saas/SaasService";
import {structuredError, structuredResponse, structuredSuccessResponse} from "@repo/utils/api";
import type {Session} from "@repo/utils/auth";
import {getSaasServiceClient} from "src/lib";

export async function getEditionsApi(data: GetApiSaasEditionsData) {
  try {
    const client = await getSaasServiceClient();
    const dataResponse = await client.edition.getApiSaasEditions(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getEditionDetailsByIdApi(id: string, session?: Session | null) {
  try {
    const client = await getSaasServiceClient(session);
    const dataResponse = await client.edition.getApiSaasEditionsById({
      id,
    });
    return structuredSuccessResponse(dataResponse);
  } catch (error) {
    throw structuredError(error);
  }
}

export async function getAllEditionsApi(session?: Session | null) {
  try {
    const client = await getSaasServiceClient(session);
    const dataResponse = await client.edition.getApiSaasEditionsAll();
    return structuredSuccessResponse(dataResponse);
  } catch (error) {
    throw structuredError(error);
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

export async function getTenantDetailsByIdApi(id: string, session?: Session | null) {
  try {
    const client = await getSaasServiceClient(session);
    const dataResponse = await client.tenant.getApiSaasTenantsById({id});
    return structuredSuccessResponse(dataResponse);
  } catch (error) {
    throw structuredError(error);
  }
}

export async function putTenantsByIdChangePasswordApi(data: PutApiSaasTenantsByIdSetPasswordData) {
  try {
    const client = await getSaasServiceClient();
    const dataResponse = await client.tenant.putApiSaasTenantsByIdSetPassword(data);
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
