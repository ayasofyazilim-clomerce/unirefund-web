"use client";

import type {PagedResultDto_IdentitySecurityLogDto} from "@ayasofyazilim/core-saas/IdentityService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import {useTenant} from "@/providers/tenant";
import type {IdentityServiceResource} from "src/language-data/core/IdentityService";
import {tableData} from "./security-logs-table-data";

function SecurityLogsTable({
  response,
  languageData,
}: {
  response: PagedResultDto_IdentitySecurityLogDto;
  languageData: IdentityServiceResource;
}) {
  const {localization} = useTenant();
  const columns = tableData.securityLogs.columns(localization, languageData);
  const table = tableData.securityLogs.table(languageData);

  return (
    <div className="mt-6 rounded-md border p-6">
      <TanstackTable {...table} columns={columns} data={response.items || []} rowCount={response.totalCount} />;
    </div>
  );
}
export default SecurityLogsTable;
