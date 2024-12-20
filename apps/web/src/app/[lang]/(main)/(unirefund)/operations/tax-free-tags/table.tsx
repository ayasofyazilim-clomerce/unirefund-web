"use client";

import type {
  TagPagedAndSortedResultResponseDto_TagListItemDto,
  UniRefund_TagService_Tags_TagListItemDto,
} from "@ayasofyazilim/saas/TagService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import type { UniRefund_CRMService_Merchants_RefundPointProfileDto } from "@ayasofyazilim/saas/CRMService";
import { useState } from "react";
import type { TagServiceResource } from "src/language-data/unirefund/TagService";
import { tableData } from "./tax-free-tags-table-data";
import { RefundForm } from "./refund-form";

function TaxFreeTagsTable({
  locale,
  response,
  languageData,
  refundPoints,
}: {
  locale: string;
  response: TagPagedAndSortedResultResponseDto_TagListItemDto;
  languageData: TagServiceResource;
  refundPoints: UniRefund_CRMService_Merchants_RefundPointProfileDto[];
}) {
  const [selectedRows, setSelectedRows] = useState<
    UniRefund_TagService_Tags_TagListItemDto[]
  >([]);
  const columns = tableData.taxFreeTags.columns(
    locale,
    languageData,
    setSelectedRows,
  );
  const table = tableData.taxFreeTags.table(languageData);

  return (
    <div className="grid h-full grid-cols-10 gap-5 overflow-hidden">
      <div className="col-span-6 h-full overflow-hidden">
        <TanstackTable
          {...table}
          columns={columns}
          data={response.items || []}
          rowCount={response.totalCount}
        />{" "}
      </div>

      <div className="col-span-4 h-full overflow-hidden">
        <RefundForm refundPoints={refundPoints} selectedRows={selectedRows} />
      </div>
    </div>
  );
}

export default TaxFreeTagsTable;
