"use client";

import type { PagedResultDto_ScopeDto } from "@ayasofyazilim/saas/IdentityService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import { useParams, useRouter } from "next/navigation";
import { useGrantedPolicies } from "@repo/utils/policies";
import type { IdentityServiceResource } from "src/language-data/core/IdentityService";
import { tableData } from "./scopes-table-data";

function ScopesTable({
  response,
  languageData,
}: {
  response: PagedResultDto_ScopeDto;
  languageData: IdentityServiceResource;
}) {
  const router = useRouter();
  const { lang } = useParams<{ lang: string }>();
  const { grantedPolicies } = useGrantedPolicies();
  const columns = tableData.scopes.columns(lang, languageData, grantedPolicies);
  const table = tableData.scopes.table(languageData, router, grantedPolicies);

  return (
    <TanstackTable
      {...table}
      columns={columns}
      data={response.items || []}
      rowCount={response.totalCount}
    />
  );
}
export default ScopesTable;
