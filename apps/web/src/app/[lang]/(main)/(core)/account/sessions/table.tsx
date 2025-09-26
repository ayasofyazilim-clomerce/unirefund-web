"use client";

import type {PagedResultDto_IdentitySessionDto} from "@ayasofyazilim/core-saas/AccountService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import {useRouter} from "next/navigation";
import type {AccountServiceResource} from "src/language-data/core/AccountService";
import {useTenant} from "@/providers/tenant";
import {tableData} from "./sessions-table-data";

function SessionsTable({
  response,
  languageData,
}: {
  response: PagedResultDto_IdentitySessionDto;
  languageData: AccountServiceResource;
}) {
  const router = useRouter();
  const {localization} = useTenant();
  const columns = tableData.sessions.columns(localization, languageData);
  const table = tableData.sessions.table(languageData, router);

  return <TanstackTable {...table} columns={columns} data={response.items || []} rowCount={response.totalCount} />;
}
export default SessionsTable;
