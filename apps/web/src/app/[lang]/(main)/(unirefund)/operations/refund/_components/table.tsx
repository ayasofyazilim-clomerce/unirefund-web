"use client";

import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import type {PagedResultDto_TagListItemDto, UniRefund_TagService_Tags_TagListItemDto} from "@repo/saas/TagService";
import type {Dispatch, SetStateAction} from "react";
import type {Localization} from "@/providers/tenant";
import type {TagServiceResource} from "src/language-data/unirefund/TagService";
import {tableData} from "./table-data";

function RefundTable({
  response,
  languageData,
  setSelectedRows,
  localization,
}: {
  localization: Localization;
  response: PagedResultDto_TagListItemDto;
  languageData: TagServiceResource;
  setSelectedRows: Dispatch<SetStateAction<UniRefund_TagService_Tags_TagListItemDto[]>>;
}) {
  const columns = tableData.taxFreeTags.columns(localization, languageData, setSelectedRows);
  const table = tableData.taxFreeTags.table();

  return <TanstackTable {...table} columns={columns} data={response.items || []} rowCount={response.totalCount} />;
}

export default RefundTable;
