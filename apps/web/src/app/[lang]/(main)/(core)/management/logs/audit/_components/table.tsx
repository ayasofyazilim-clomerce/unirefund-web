"use client";

import type {PagedResultDto_AuditLogDto} from "@ayasofyazilim/saas/AdministrationService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import {useParams} from "next/navigation";
import type {AdministrationServiceResource} from "src/language-data/core/AdministrationService";
import {tableData} from "./audit-table-data";

function AuditLogsTable({
  response,
  languageData,
}: {
  response: PagedResultDto_AuditLogDto;
  languageData: AdministrationServiceResource;
}) {
  const {lang} = useParams<{lang: string}>();
  const columns = tableData.auditLogs.columns(lang, languageData);
  const table = tableData.auditLogs.table(languageData);

  return <TanstackTable {...table} columns={columns} data={response.items || []} rowCount={response.totalCount} />;
}
export default AuditLogsTable;
