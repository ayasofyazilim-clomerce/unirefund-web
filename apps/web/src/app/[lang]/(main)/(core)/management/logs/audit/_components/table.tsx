"use client";

import type {PagedResultDto_AuditLogDto} from "@ayasofyazilim/core-saas/AdministrationService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import {useTenant} from "@/providers/tenant";
import type {AdministrationServiceResource} from "src/language-data/core/AdministrationService";
import {tableData} from "./audit-table-data";

function AuditLogsTable({
  response,
  languageData,
}: {
  response: PagedResultDto_AuditLogDto;
  languageData: AdministrationServiceResource;
}) {
  const {localization} = useTenant();
  const columns = tableData.auditLogs.columns(localization, languageData);
  const table = tableData.auditLogs.table(languageData);

  return <TanstackTable {...table} columns={columns} data={response.items || []} rowCount={response.totalCount} />;
}
export default AuditLogsTable;
