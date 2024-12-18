"use client";

import type { TagPagedAndSortedResultResponseDto_TagListItemDto } from "@ayasofyazilim/saas/TagService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import type { TagServiceResource } from "src/language-data/unirefund/TagService";
import { tableData } from "./tax-free-tags-table-data";

function TaxFreeTagsTable({
  locale,
  response,
  languageData,
}: {
  locale: string;
  response: TagPagedAndSortedResultResponseDto_TagListItemDto;
  languageData: TagServiceResource;
}) {
  const columns = tableData.taxFreeTags.columns(locale, languageData);
  const table = tableData.taxFreeTags.table(languageData);

  return (
    <TanstackTable
      {...table}
      columns={columns}
      data={response.items || []}
      rowCount={response.totalCount}
    />
  );
}

export default TaxFreeTagsTable;
