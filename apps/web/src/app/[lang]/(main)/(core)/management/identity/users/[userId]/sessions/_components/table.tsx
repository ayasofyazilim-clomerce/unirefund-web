"use client";

import type {PagedResultDto_IdentitySessionDto} from "@ayasofyazilim/core-saas/IdentityService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import {useRouter} from "next/navigation";
import type {IdentityServiceResource} from "src/language-data/core/IdentityService";
import {useTenant} from "@/providers/tenant";
import {tableData} from "./sessions-table-data";

function SessionsTable({
  response,
  languageData,
}: {
  response: PagedResultDto_IdentitySessionDto;
  languageData: IdentityServiceResource;
}) {
  const router = useRouter();
  const {localization} = useTenant();
  const columns = tableData.sessions.columns(localization, languageData);
  const table = tableData.sessions.table(languageData, router);

  return <TanstackTable {...table} columns={columns} data={response.items || []} rowCount={response.totalCount} />;
}
export default SessionsTable;
