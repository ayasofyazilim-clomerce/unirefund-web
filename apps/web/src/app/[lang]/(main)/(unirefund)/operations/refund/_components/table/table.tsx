"use client";

import type {PagedResultDto_TagListItemDto, UniRefund_TagService_Tags_TagListItemDto} from "@repo/saas/TagService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import type {Dispatch, SetStateAction} from "react";
import type {TagServiceResource} from "src/language-data/unirefund/TagService";
import {useTenant} from "@/providers/tenant";
import {tableData} from "./table-data";

function RefundTable({
  response,
  languageData,
  setSelectedRows,
}: {
  locale: string;
  response: PagedResultDto_TagListItemDto;
  languageData: TagServiceResource;
  setSelectedRows: Dispatch<SetStateAction<UniRefund_TagService_Tags_TagListItemDto[]>>;
}) {
  const {localization} = useTenant();
  const columns = tableData.taxFreeTags.columns(localization, languageData, setSelectedRows);
  const table = tableData.taxFreeTags.table();

  return <TanstackTable {...table} columns={columns} data={response.items || []} rowCount={response.totalCount} />;
}

export default RefundTable;
