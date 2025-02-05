"use client";

import type {
  PagedResultDto_IdentityUserDto,
  Volo_Abp_Identity_IdentityRoleLookupDto,
  Volo_Abp_Identity_OrganizationUnitLookupDto,
} from "@ayasofyazilim/saas/IdentityService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import {useParams, useRouter} from "next/navigation";
import {useGrantedPolicies} from "@repo/utils/policies";
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
  const {lang} = useParams<{lang: string}>();
  const {grantedPolicies} = useGrantedPolicies();
  const columns = tableData.users.columns(lang, languageData, grantedPolicies);
  const table = tableData.users.table(languageData, router, grantedPolicies, roleList, organizationList);

  return <TanstackTable {...table} columns={columns} data={response.items || []} rowCount={response.totalCount} />;
}
export default UsersTable;
