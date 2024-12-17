"use server";
import type {
  PutApiIdentityAssignableRolesData,
  PutApiIdentityUsersByIdChangePasswordData,
  PutApiIdentityUsersByIdTwoFactorByEnabledData,
  PutApiOpeniddictApplicationsByIdTokenLifetimeData,
} from "@ayasofyazilim/saas/IdentityService";
import {
  getIdentityServiceClient,
  structuredError,
  structuredResponse,
} from "src/lib";
import { getApiRequests } from "../../api-requests";

export async function putApplicationTokenLifetimeApi(
  data: PutApiOpeniddictApplicationsByIdTokenLifetimeData,
) {
  try {
    const requests = await getApiRequests();
    const dataResponse = await requests.applications.putTokenLifetime(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function putUserChangePasswordApi(
  data: PutApiIdentityUsersByIdChangePasswordData,
) {
  try {
    const requests = await getApiRequests();
    const dataResponse = await requests.users.putChangePassword(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function putUserTwoFactorApi(
  data: PutApiIdentityUsersByIdTwoFactorByEnabledData,
) {
  try {
    const requests = await getApiRequests();
    const dataResponse = await requests.users.putTwoFactorEnable(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function putAssignableRolesApi(
  data: PutApiIdentityAssignableRolesData,
) {
  try {
    const client = await getIdentityServiceClient();
    const dataResponse =
      await client.assignableRole.putApiIdentityAssignableRoles(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
