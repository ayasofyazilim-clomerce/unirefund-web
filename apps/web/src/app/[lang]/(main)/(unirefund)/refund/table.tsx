"use client";

import type { PagedResultDto_RefundListItem } from "@ayasofyazilim/saas/RefundService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import { useRouter } from "next/navigation";
import type { ContractServiceResource } from "src/language-data/unirefund/ContractService";
import useGrantedPolicies from "src/hooks/use-granted-policies";
import { tableData } from "./table-data";

function RefundTable({
  locale,
  response,
  languageData,
}: {
  locale: string;
  response: PagedResultDto_RefundListItem;
  languageData: ContractServiceResource;
}) {
  const grantedPolicies = useGrantedPolicies();
  const router = useRouter();
  const columns = tableData.refund.columns(locale);
  const table = tableData.refund.table(languageData, router, grantedPolicies);

  return (
    <TanstackTable
      {...table}
      columns={columns}
      data={response.items || []}
      rowCount={response.totalCount}
    />
  );
}

export default RefundTable;
