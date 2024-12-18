"use client";

import type { PagedResultDto_RefundListItem } from "@ayasofyazilim/saas/RefundService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import { useRouter } from "next/navigation";
import type { TagServiceResource } from "src/language-data/unirefund/TagService";
import { useGrantedPolicies } from "src/providers/granted-policies";
import { tableData } from "./refunds-table-data";

function RefundsTable({
  locale,
  response,
  languageData,
}: {
  locale: string;
  response: PagedResultDto_RefundListItem;
  languageData: TagServiceResource;
}) {
  const { grantedPolicies } = useGrantedPolicies();
  const router = useRouter();
  const columns = tableData.refunds.columns(locale, languageData);
  const table = tableData.refunds.table(languageData, router, grantedPolicies);

  return (
    <TanstackTable
      {...table}
      columns={columns}
      data={response.items || []}
      rowCount={response.totalCount}
    />
  );
}

export default RefundsTable;
