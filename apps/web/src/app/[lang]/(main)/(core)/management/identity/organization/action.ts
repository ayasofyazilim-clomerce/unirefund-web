/* eslint-disable @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access -- TODO: we need to fix this*/
import { getBaseLink } from "src/utils";

export interface OrganizationUnit {
  parentId: string;
  code: string;
  displayName: string;
  id: string;
}

export interface User {
  id: string;
  userName: string;
  email: string;
}

export interface Role {
  name: string;
  id: string;
}

const fetchData = async <T>(url: string): Promise<T[]> => {
  try {
    const response = await fetch(getBaseLink(url));
    if (response.ok) {
      const data = await response.json();
      return data.items;
    }
    return [];
  } catch (error) {
    return [];
  }
};

export const fetchOrganizationUnits = async (): Promise<OrganizationUnit[]> => {
  return fetchData<OrganizationUnit>("api/admin/organization");
};

export const fetchUsers = async (): Promise<User[]> => {
  return fetchData<User>("api/admin/user");
};

export const fetchRoles = async (): Promise<Role[]> => {
  return fetchData<Role>("api/admin/role");
};

export const fetchUsersForUnit = async (unitId: string): Promise<User[]> => {
  return fetchData<User>(`api/organization/organizationUser?id=${unitId}`);
};

export const fetchRolesForUnit = async (unitId: string): Promise<Role[]> => {
  return fetchData<Role>(`api/organization/organizationRole?id=${unitId}`);
};
