"use client";

import type {PagedResultDto_RefundListItem} from "@repo/saas/RefundService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import type {TagServiceResource} from "src/language-data/unirefund/TagService";
import {tableData} from "./refunds-table-data";

function RefundsTable({
  locale,
  response,
  languageData,
}: {
  locale: string;
  response: PagedResultDto_RefundListItem;
  languageData: TagServiceResource;
}) {
  const columns = tableData.refunds.columns(locale, languageData);
  const table = tableData.refunds.table(languageData);

  return <TanstackTable {...table} columns={columns} data={response.items || []} rowCount={response.totalCount} />;
}

export default RefundsTable;
