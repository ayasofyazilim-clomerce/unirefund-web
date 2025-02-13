"use server";

import type {
  PostApiIdentityClaimTypesData,
  PostApiIdentityOrganizationUnitsData,
  PostApiIdentityRolesData,
  PostApiIdentityUsersData,
  PostApiOpeniddictApplicationsData,
  PostApiOpeniddictScopesData,
} from "@ayasofyazilim/core-saas/IdentityService";
import {structuredError, structuredResponse} from "@repo/utils/api";
import {getIdentityServiceClient} from "src/lib";

export async function postRoleApi(data: PostApiIdentityRolesData) {
  try {
    const client = await getIdentityServiceClient();
    const dataResponse = await client.role.postApiIdentityRoles(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function postUserApi(data: PostApiIdentityUsersData) {
  try {
    const client = await getIdentityServiceClient();
    const dataResponse = await client.user.postApiIdentityUsers(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function postClaimTypeApi(data: PostApiIdentityClaimTypesData) {
  try {
    const client = await getIdentityServiceClient();
    const dataResponse = await client.claimType.postApiIdentityClaimTypes(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function postScopeApi(data: PostApiOpeniddictScopesData) {
  try {
    const client = await getIdentityServiceClient();
    const dataResponse = await client.scopes.postApiOpeniddictScopes(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function postApplicationApi(data: PostApiOpeniddictApplicationsData) {
  try {
    const client = await getIdentityServiceClient();
    const dataResponse = await client.applications.postApiOpeniddictApplications(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function postOrganizationUnitsApi(data: PostApiIdentityOrganizationUnitsData) {
  try {
    const client = await getIdentityServiceClient();
    const dataResponse = await client.organizationUnit.postApiIdentityOrganizationUnits(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
