"use client";

import type {PagedResultDto_TagListItemDto, UniRefund_TagService_Tags_TagListItemDto} from "@repo/saas/TagService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import type {Dispatch, SetStateAction} from "react";
import type {TagServiceResource} from "src/language-data/unirefund/TagService";
import {tableData} from "./table-data";

function RefundTable({
  locale,
  response,
  languageData,
  setSelectedRows,
}: {
  locale: string;
  response: PagedResultDto_TagListItemDto;
  languageData: TagServiceResource;
  setSelectedRows: Dispatch<SetStateAction<UniRefund_TagService_Tags_TagListItemDto[]>>;
}) {
  const columns = tableData.taxFreeTags.columns(locale, languageData, setSelectedRows);
  const table = tableData.taxFreeTags.table();

  return <TanstackTable {...table} columns={columns} data={response.items || []} rowCount={response.totalCount} />;
}

export default RefundTable;
