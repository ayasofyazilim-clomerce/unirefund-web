"use client";

import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import {useParams} from "next/navigation";
import type {PagedResultDto_IdentitySecurityLogDto} from "@ayasofyazilim/saas/IdentityService";
import type {IdentityServiceResource} from "src/language-data/core/IdentityService";
import {tableData} from "./security-logs-table-data";

function SecurityLogsTable({
  response,
  languageData,
}: {
  response: PagedResultDto_IdentitySecurityLogDto;
  languageData: IdentityServiceResource;
}) {
  const {lang} = useParams<{lang: string}>();
  const columns = tableData.securityLogs.columns(lang, languageData);
  const table = tableData.securityLogs.table(languageData);

  return <TanstackTable {...table} columns={columns} data={response.items || []} rowCount={response.totalCount} />;
}
export default SecurityLogsTable;
