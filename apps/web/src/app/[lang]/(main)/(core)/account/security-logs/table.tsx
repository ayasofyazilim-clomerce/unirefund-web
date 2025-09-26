"use client";

import type {PagedResultDto_IdentitySecurityLogDto} from "@ayasofyazilim/core-saas/AccountService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import type {AccountServiceResource} from "src/language-data/core/AccountService";
import {useTenant} from "@/providers/tenant";
import {tableData} from "./security-logs-table-data";

function SecurityLogsTable({
  response,
  languageData,
}: {
  response: PagedResultDto_IdentitySecurityLogDto;
  languageData: AccountServiceResource;
}) {
  const {localization} = useTenant();
  const columns = tableData.securityLogs.columns(localization, languageData);
  const table = tableData.securityLogs.table(languageData);

  return <TanstackTable {...table} columns={columns} data={response.items || []} rowCount={response.totalCount} />;
}
export default SecurityLogsTable;
