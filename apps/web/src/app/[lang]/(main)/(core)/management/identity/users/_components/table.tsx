"use client";

import type {
  PagedResultDto_IdentityUserDto,
  Volo_Abp_Identity_IdentityRoleLookupDto,
  Volo_Abp_Identity_OrganizationUnitLookupDto,
} from "@ayasofyazilim/core-saas/IdentityService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import {useGrantedPolicies} from "@repo/utils/policies";
import {useRouter} from "next/navigation";
import {useTenant} from "@/providers/tenant";
import type {IdentityServiceResource} from "src/language-data/core/IdentityService";
import {tableData} from "./users-table-data";

function UsersTable({
  response,
  languageData,
  roleList,
  organizationList,
}: {
  response: PagedResultDto_IdentityUserDto;
  languageData: IdentityServiceResource;
  roleList: Volo_Abp_Identity_IdentityRoleLookupDto[];
  organizationList: Volo_Abp_Identity_OrganizationUnitLookupDto[];
}) {
  const router = useRouter();
  const {localization} = useTenant();
  const {grantedPolicies} = useGrantedPolicies();
  const columns = tableData.users.columns(localization, languageData, grantedPolicies);
  const table = tableData.users.table(languageData, router, grantedPolicies, roleList, organizationList);

  return <TanstackTable {...table} columns={columns} data={response.items || []} rowCount={response.totalCount} />;
}
export default UsersTable;
