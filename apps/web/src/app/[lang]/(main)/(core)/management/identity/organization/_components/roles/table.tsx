"use client";

import type {
  PagedResultDto_IdentityRoleDto,
  Volo_Abp_Identity_IdentityRoleDto,
} from "@ayasofyazilim/core-saas/IdentityService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import {useRouter} from "next/navigation";
import {useTenant} from "@/providers/tenant";
import type {IdentityServiceResource} from "src/language-data/core/IdentityService";
import {tableData} from "./organization-roles-table-data";

function OrganizationRolesTable({
  languageData,
  roleList,
  unitRoles,
  selectedUnitId,
}: {
  languageData: IdentityServiceResource;
  roleList: PagedResultDto_IdentityRoleDto;
  unitRoles: Volo_Abp_Identity_IdentityRoleDto[];
  selectedUnitId: string;
}) {
  const {localization} = useTenant();
  const router = useRouter();
  const columns = tableData.roles.columns(localization, languageData, unitRoles);
  const table = tableData.roles.table(languageData, selectedUnitId, router);

  return <TanstackTable {...table} columns={columns} data={roleList.items || []} rowCount={roleList.totalCount || 0} />;
}
export default OrganizationRolesTable;
