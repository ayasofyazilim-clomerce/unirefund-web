"use client";

import type {
  PagedResultDto_IdentityUserDto,
  Volo_Abp_Identity_IdentityUserDto,
} from "@ayasofyazilim/saas/IdentityService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import { useParams, useRouter } from "next/navigation";
import type { IdentityServiceResource } from "src/language-data/core/IdentityService";
import { tableData } from "./organization-users-table-data";

function OrganizationUsersTable({
  languageData,
  userList,
  unitUsers,
  selectedUnitId,
}: {
  languageData: IdentityServiceResource;
  userList: PagedResultDto_IdentityUserDto;
  unitUsers: Volo_Abp_Identity_IdentityUserDto[];
  selectedUnitId: string;
}) {
  const { lang } = useParams<{ lang: string }>();
  const router = useRouter();
  const columns = tableData.users.columns(lang, languageData, unitUsers);
  const table = tableData.users.table(languageData, selectedUnitId, router);

  return (
    <TanstackTable
      {...table}
      columns={columns}
      data={userList.items || []}
      rowCount={userList.totalCount || 0}
    />
  );
}
export default OrganizationUsersTable;
