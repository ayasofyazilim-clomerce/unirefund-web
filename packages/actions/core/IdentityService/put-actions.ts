"use server";
import type {
  PutApiIdentityAssignableRolesData,
  PutApiIdentityClaimTypesByIdData,
  PutApiIdentityOrganizationUnitsByIdData,
  PutApiIdentityOrganizationUnitsByIdMembersData,
  PutApiIdentityOrganizationUnitsByIdMoveAllUsersData,
  PutApiIdentityOrganizationUnitsByIdMoveData,
  PutApiIdentityOrganizationUnitsByIdRolesData,
  PutApiIdentityRolesByIdClaimsData,
  PutApiIdentityRolesByIdData,
  PutApiIdentityRolesByIdMoveAllUsersData,
  PutApiIdentityUsersByIdChangePasswordData,
  PutApiIdentityUsersByIdClaimsData,
  PutApiIdentityUsersByIdData,
  PutApiIdentityUsersByIdLockByLockoutEndData,
  PutApiIdentityUsersByIdTwoFactorByEnabledData,
  PutApiOpeniddictApplicationsByIdData,
  PutApiOpeniddictApplicationsByIdTokenLifetimeData,
  PutApiOpeniddictScopesByIdData,
} from "@ayasofyazilim/core-saas/IdentityService";
import {structuredError, structuredResponse} from "@repo/utils/api";
import {getIdentityServiceClient} from "../lib";

export async function putUsersByIdTwoFactorByEnabledApi(data: PutApiIdentityUsersByIdTwoFactorByEnabledData) {
  try {
    const client = await getIdentityServiceClient();
    const dataResponse = await client.user.putApiIdentityUsersByIdTwoFactorByEnabled(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function putAssignableRolesApi(data: PutApiIdentityAssignableRolesData) {
  try {
    const client = await getIdentityServiceClient();
    const dataResponse = await client.assignableRole.putApiIdentityAssignableRoles(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function putUserClaimsByIdApi(data: PutApiIdentityUsersByIdClaimsData) {
  try {
    const client = await getIdentityServiceClient();
    const response = await client.user.putApiIdentityUsersByIdClaims(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function putRoleClaimsByIdApi(body: PutApiIdentityRolesByIdClaimsData) {
  try {
    const client = await getIdentityServiceClient();
    const response = await client.role.putApiIdentityRolesByIdClaims(body);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function putRolesByIdMoveAllUsersApi(data: PutApiIdentityRolesByIdMoveAllUsersData) {
  try {
    const client = await getIdentityServiceClient();
    const dataResponse = await client.role.putApiIdentityRolesByIdMoveAllUsers(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function putRoleApi(data: PutApiIdentityRolesByIdData) {
  try {
    const client = await getIdentityServiceClient();
    const dataResponse = await client.role.putApiIdentityRolesById(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function putUserApi(data: PutApiIdentityUsersByIdData) {
  try {
    const client = await getIdentityServiceClient();
    const dataResponse = await client.user.putApiIdentityUsersById(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function putUsersByIdChangePasswordApi(data: PutApiIdentityUsersByIdChangePasswordData) {
  try {
    const client = await getIdentityServiceClient();
    const dataResponse = await client.user.putApiIdentityUsersByIdChangePassword(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function putClaimTypeApi(data: PutApiIdentityClaimTypesByIdData) {
  try {
    const client = await getIdentityServiceClient();
    const dataResponse = await client.claimType.putApiIdentityClaimTypesById(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function putScopeApi(data: PutApiOpeniddictScopesByIdData) {
  try {
    const client = await getIdentityServiceClient();
    const dataResponse = await client.scopes.putApiOpeniddictScopesById(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function putApplicationApi(data: PutApiOpeniddictApplicationsByIdData) {
  try {
    const client = await getIdentityServiceClient();
    const dataResponse = await client.applications.putApiOpeniddictApplicationsById(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function putApplicationsByIdTokenLifetimeApi(data: PutApiOpeniddictApplicationsByIdTokenLifetimeData) {
  try {
    const client = await getIdentityServiceClient();
    const dataResponse = await client.applications.putApiOpeniddictApplicationsByIdTokenLifetime(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function putUsersByIdLockByLockoutEndApi(data: PutApiIdentityUsersByIdLockByLockoutEndData) {
  try {
    const client = await getIdentityServiceClient();
    const dataResponse = await client.user.putApiIdentityUsersByIdLockByLockoutEnd(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function putUsersByIdUnlockApi(id: string) {
  try {
    const client = await getIdentityServiceClient();
    const dataResponse = await client.user.putApiIdentityUsersByIdUnlock({
      id,
    });
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function putOrganizationUnitsByIdApi(data: PutApiIdentityOrganizationUnitsByIdData) {
  try {
    const client = await getIdentityServiceClient();
    const dataResponse = await client.organizationUnit.putApiIdentityOrganizationUnitsById(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function putOrganizationUnitsByIdMembersApi(data: PutApiIdentityOrganizationUnitsByIdMembersData) {
  try {
    const client = await getIdentityServiceClient();
    const dataResponse = await client.organizationUnit.putApiIdentityOrganizationUnitsByIdMembers(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function putOrganizationUnitsByIdMoveApi(data: PutApiIdentityOrganizationUnitsByIdMoveData) {
  try {
    const client = await getIdentityServiceClient();
    const dataResponse = await client.organizationUnit.putApiIdentityOrganizationUnitsByIdMove(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function putOrganizationUnitsByIdMoveAllUsersApi(
  data: PutApiIdentityOrganizationUnitsByIdMoveAllUsersData,
) {
  try {
    const client = await getIdentityServiceClient();
    const dataResponse = await client.organizationUnit.putApiIdentityOrganizationUnitsByIdMoveAllUsers(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function putOrganizationUnitsByIdRolesApi(data: PutApiIdentityOrganizationUnitsByIdRolesData) {
  try {
    const client = await getIdentityServiceClient();
    const dataResponse = await client.organizationUnit.putApiIdentityOrganizationUnitsByIdRoles(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
