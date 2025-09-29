"use client";

import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import type {PagedResultDto_RefundListItem} from "@repo/saas/RefundService";
import {useTenant} from "@/providers/tenant";
import type {TagServiceResource} from "src/language-data/unirefund/TagService";
import {tableData} from "./refunds-table-data";

function RefundsTable({
  response,
  languageData,
}: {
  locale: string;
  response: PagedResultDto_RefundListItem;
  languageData: TagServiceResource;
}) {
  const {localization} = useTenant();
  const columns = tableData.refunds.columns(localization, languageData);
  const table = tableData.refunds.table(languageData);

  return <TanstackTable {...table} columns={columns} data={response.items || []} rowCount={response.totalCount} />;
}

export default RefundsTable;
