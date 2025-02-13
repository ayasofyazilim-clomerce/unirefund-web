"use client";

import type {PagedResultDto_IdentitySessionDto} from "@ayasofyazilim/core-saas/AccountService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import {useParams, useRouter} from "next/navigation";
import type {AccountServiceResource} from "src/language-data/core/AccountService";
import {tableData} from "./sessions-table-data";

function SessionsTable({
  response,
  languageData,
}: {
  response: PagedResultDto_IdentitySessionDto;
  languageData: AccountServiceResource;
}) {
  const router = useRouter();
  const {lang} = useParams<{lang: string}>();
  const columns = tableData.sessions.columns(lang, languageData);
  const table = tableData.sessions.table(languageData, router);

  return <TanstackTable {...table} columns={columns} data={response.items || []} rowCount={response.totalCount} />;
}
export default SessionsTable;
