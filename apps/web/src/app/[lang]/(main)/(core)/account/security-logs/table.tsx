"use client";

import type { PagedResultDto_IdentitySecurityLogDto } from "@ayasofyazilim/saas/AccountService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import { useParams } from "next/navigation";
import type { AccountServiceResource } from "src/language-data/core/AccountService";
import { tableData } from "./security-logs-table-data";

function SecurityLogsTable({
  response,
  languageData,
}: {
  response: PagedResultDto_IdentitySecurityLogDto;
  languageData: AccountServiceResource;
}) {
  const { lang } = useParams<{ lang: string }>();
  const columns = tableData.securityLogs.columns(lang, languageData);
  const table = tableData.securityLogs.table(languageData);

  return (
    <TanstackTable
      {...table}
      columns={columns}
      data={response.items || []}
      rowCount={response.totalCount}
    />
  );
}
export default SecurityLogsTable;
