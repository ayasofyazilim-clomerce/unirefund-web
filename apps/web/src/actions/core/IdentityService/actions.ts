"use server";
import type {
  GetApiIdentityClaimTypesData,
  GetApiIdentityRolesByIdClaimsData,
  GetApiIdentitySessionsData,
  GetApiIdentityUsersByIdClaimsData,
  GetApiOpeniddictApplicationsByIdTokenLifetimeData,
  PutApiIdentityRolesByIdClaimsData,
  PutApiIdentityRolesByIdMoveAllUsersData,
  PutApiIdentityUsersByIdClaimsData,
} from "@ayasofyazilim/saas/IdentityService";
import { structuredError, structuredResponse } from "src/lib";
import { getApiRequests } from "../../api-requests";

export async function getClaimsApi(body: GetApiIdentityClaimTypesData = {}) {
  try {
    const requests = await getApiRequests();
    const response = await requests.claims.get(body);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function putRoleClaimsApi(
  body: PutApiIdentityRolesByIdClaimsData,
) {
  try {
    const requests = await getApiRequests();
    const response = await requests.roles.putRoleClaims(body);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getRoleClaimsApi(
  body: GetApiIdentityRolesByIdClaimsData,
) {
  try {
    const requests = await getApiRequests();
    const response = await requests.roles.getRoleClaims(body);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function putUserClaimsApi(
  body: PutApiIdentityUsersByIdClaimsData,
) {
  try {
    const requests = await getApiRequests();
    const response = await requests.users.putUserClaims(body);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getUserClaimsApi(
  body: GetApiIdentityUsersByIdClaimsData,
) {
  try {
    const requests = await getApiRequests();
    const response = await requests.users.getUserClaims(body);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getAllRolesApi() {
  try {
    const requests = await getApiRequests();
    const dataResponse = await requests.roles.getAllRoles();
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function moveAllUsersApi(
  data: PutApiIdentityRolesByIdMoveAllUsersData,
) {
  try {
    const requests = await getApiRequests();
    const dataResponse = await requests.roles.MoveAllUsers(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getApplicationTokenLifetimeApi(
  data: GetApiOpeniddictApplicationsByIdTokenLifetimeData,
) {
  try {
    const requests = await getApiRequests();
    const dataResponse = await requests.applications.getTokenLifetime(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getTwoFactorEnableApi(id: string) {
  try {
    const requests = await getApiRequests();
    const dataResponse = await requests.users.getTwoFactorEnable(id);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getUserSessionsApi(data: GetApiIdentitySessionsData) {
  try {
    const requests = await getApiRequests();
    const dataResponse = await requests.sessions.get(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getUserOrganizationApi(id: string) {
  try {
    const requests = await getApiRequests();
    const dataResponse = await requests.users.getUserOrganization(id);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function deleteUserSessionsApi(id: string) {
  try {
    const requests = await getApiRequests();
    const dataResponse = await requests.sessions.deleteRow(id);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
