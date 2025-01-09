"use client";
import { type PagedResultDto_AffiliationCodeDto } from "@ayasofyazilim/saas/CRMService";
import type { GetApiIdentityRolesAssignableRolesByCurrentUserResponse } from "@ayasofyazilim/saas/IdentityService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import { useParams } from "next/navigation";
import type { CRMServiceServiceResource } from "src/language-data/unirefund/CRMService";
import { useGrantedPolicies } from "src/providers/granted-policies";
import { tableData } from "./affiliations-table-data";

function AffiliationsTable({
  languageData,
  response,
  assignableRoles,
}: {
  languageData: CRMServiceServiceResource;
  response: PagedResultDto_AffiliationCodeDto;
  assignableRoles: GetApiIdentityRolesAssignableRolesByCurrentUserResponse;
}) {
  const { lang } = useParams<{ lang: string }>();
  const { grantedPolicies } = useGrantedPolicies();
  const columns = tableData.affiliations.columns(
    languageData,
    lang,
    grantedPolicies,
  );
  const table = tableData.affiliations.table(
    languageData,
    assignableRoles,
    grantedPolicies,
  );

  return (
    <TanstackTable
      {...table}
      columns={columns}
      data={response.items || []}
      rowCount={response.totalCount}
    />
  );
}
export default AffiliationsTable;
