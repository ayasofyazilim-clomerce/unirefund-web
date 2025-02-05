"use server";

import type {
  GetApiIdentityClaimTypesData,
  GetApiIdentityOrganizationUnitsAvailableRolesData,
  GetApiIdentityOrganizationUnitsAvailableUsersData,
  GetApiIdentityOrganizationUnitsByIdMembersData,
  GetApiIdentityOrganizationUnitsByIdRolesData,
  GetApiIdentityRolesData,
  GetApiIdentitySecurityLogsData,
  GetApiIdentitySessionsData,
  GetApiIdentityUsersData,
  GetApiOpeniddictApplicationsData,
  GetApiOpeniddictScopesData,
} from "@ayasofyazilim/saas/IdentityService";
import {structuredSuccessResponse} from "@repo/utils/api";
import type {Session} from "@repo/utils/auth";
import {getIdentityServiceClient, structuredError, structuredResponse} from "src/lib";

export async function getRolesByIdClaimsApi(id: string) {
  try {
    const client = await getIdentityServiceClient();
    const response = await client.role.getApiIdentityRolesByIdClaims({id});
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function getAllRoleClaimsApi() {
  try {
    const client = await getIdentityServiceClient();
    const response = await client.role.getApiIdentityRolesAllClaimTypes();
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function getUsersByIdClaimsApi(id: string) {
  try {
    const client = await getIdentityServiceClient();
    const response = await client.user.getApiIdentityUsersByIdClaims({id});
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getAllUserClaimsApi() {
  try {
    const client = await getIdentityServiceClient();
    const response = await client.user.getApiIdentityUsersAllClaimTypes();
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getAllRolesApi() {
  try {
    const client = await getIdentityServiceClient();
    const dataResponse = await client.role.getApiIdentityRolesAll();
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getUsersByIdTwoFactorEnabledApi(id: string) {
  try {
    const client = await getIdentityServiceClient();
    const dataResponse = await client.user.getApiIdentityUsersByIdTwoFactorEnabled({id});
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getSessionsApi(data: GetApiIdentitySessionsData) {
  try {
    const client = await getIdentityServiceClient();
    const dataResponse = await client.sessions.getApiIdentitySessions(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getUserOrganizationByIdApi(id: string) {
  try {
    const client = await getIdentityServiceClient();
    const dataResponse = await client.user.getApiIdentityUsersByIdOrganizationUnits({id});
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getAssignableRolesApi(roleId: string) {
  try {
    const client = await getIdentityServiceClient();
    const dataResponse = await client.assignableRole.getApiIdentityAssignableRolesAllRolesWithAssignableByRoleId({
      roleId,
    });
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
export async function getAssignableRolesByCurrentUserApi(session?: Session | null) {
  try {
    const client = await getIdentityServiceClient(session);
    const dataResponse = await client.role.getApiIdentityRolesAssignableRolesByCurrentUser();
    return structuredSuccessResponse(dataResponse);
  } catch (error) {
    throw structuredError(error);
  }
}

export async function getIdentitySecurityLogsApi(data: GetApiIdentitySecurityLogsData) {
  try {
    const client = await getIdentityServiceClient();
    const dataResponse = await client.securityLog.getApiIdentitySecurityLogs(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getRolesApi(data: GetApiIdentityRolesData = {}) {
  try {
    const client = await getIdentityServiceClient();
    const dataResponse = await client.role.getApiIdentityRoles(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getRoleDetailsByIdApi(id: string) {
  try {
    const client = await getIdentityServiceClient();
    const dataResponse = await client.role.getApiIdentityRolesById({id});
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getUsersApi(data: GetApiIdentityUsersData) {
  try {
    const client = await getIdentityServiceClient();
    const dataResponse = await client.user.getApiIdentityUsers(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getUserDetailsByIdApi(id: string) {
  try {
    const client = await getIdentityServiceClient();
    const dataResponse = await client.user.getApiIdentityUsersByIdById({id});
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getUsersLookupRolesApi() {
  try {
    const client = await getIdentityServiceClient();
    const dataResponse = await client.user.getApiIdentityUsersLookupRoles();
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getUsersLookupOrganizationUnitsApi() {
  try {
    const client = await getIdentityServiceClient();
    const dataResponse = await client.user.getApiIdentityUsersLookupOrganizationUnits();
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getUsersAssignableRolesApi() {
  try {
    const client = await getIdentityServiceClient();
    const dataResponse = await client.user.getApiIdentityUsersAssignableRoles();
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getUsersAvailableOrganizationUnitsApi() {
  try {
    const client = await getIdentityServiceClient();
    const dataResponse = await client.user.getApiIdentityUsersAvailableOrganizationUnits();
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getUsersByIdRolesApi(id: string) {
  try {
    const client = await getIdentityServiceClient();
    const dataResponse = await client.user.getApiIdentityUsersByIdRoles({id});
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getUsersByIdOrganizationUnitsApi(id: string) {
  try {
    const client = await getIdentityServiceClient();
    const dataResponse = await client.user.getApiIdentityUsersByIdOrganizationUnits({id});
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getClaimTypesApi(data: GetApiIdentityClaimTypesData) {
  try {
    const client = await getIdentityServiceClient();
    const response = await client.claimType.getApiIdentityClaimTypes(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getClaimTypeDetailsByIdApi(id: string) {
  try {
    const client = await getIdentityServiceClient();
    const response = await client.claimType.getApiIdentityClaimTypesById({
      id,
    });
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getScopesApi(data: GetApiOpeniddictScopesData) {
  try {
    const client = await getIdentityServiceClient();
    const response = await client.scopes.getApiOpeniddictScopes(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getAllScopesApi() {
  try {
    const client = await getIdentityServiceClient();
    const response = await client.scopes.getApiOpeniddictScopesAll();
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getScopeDetailsByIdApi(id: string) {
  try {
    const client = await getIdentityServiceClient();
    const response = await client.scopes.getApiOpeniddictScopesById({id});
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getApplicationsApi(data: GetApiOpeniddictApplicationsData) {
  try {
    const client = await getIdentityServiceClient();
    const response = await client.applications.getApiOpeniddictApplications(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getApplicationDetailsByIdApi(id: string) {
  try {
    const client = await getIdentityServiceClient();
    const response = await client.applications.getApiOpeniddictApplicationsById({id});
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getApplicationsByIdTokenLifetimeApi(id: string) {
  try {
    const client = await getIdentityServiceClient();
    const response = await client.applications.getApiOpeniddictApplicationsByIdTokenLifetime({
      id,
    });
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getAllOrganizationUnitsApi() {
  try {
    const client = await getIdentityServiceClient();
    const response = await client.organizationUnit.getApiIdentityOrganizationUnitsAll();
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getOrganizationUnitsAvailableRolesApi(data: GetApiIdentityOrganizationUnitsAvailableRolesData) {
  try {
    const client = await getIdentityServiceClient();
    const response = await client.organizationUnit.getApiIdentityOrganizationUnitsAvailableRoles(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getOrganizationUnitsAvailableUsersApi(data: GetApiIdentityOrganizationUnitsAvailableUsersData) {
  try {
    const client = await getIdentityServiceClient();
    const response = await client.organizationUnit.getApiIdentityOrganizationUnitsAvailableUsers(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getOrganizationUnitsByIdMembersApi(data: GetApiIdentityOrganizationUnitsByIdMembersData) {
  try {
    const client = await getIdentityServiceClient();
    const response = await client.organizationUnit.getApiIdentityOrganizationUnitsByIdMembers(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getOrganizationUnitsByIdRolesApi(data: GetApiIdentityOrganizationUnitsByIdRolesData) {
  try {
    const client = await getIdentityServiceClient();
    const response = await client.organizationUnit.getApiIdentityOrganizationUnitsByIdRoles(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
