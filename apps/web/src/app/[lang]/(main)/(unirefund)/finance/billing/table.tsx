"use client";

import type { PagedResultDto_BillingDto } from "@ayasofyazilim/saas/FinanceService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import { useRouter } from "next/navigation";
import type { FinanceServiceResource } from "src/language-data/unirefund/FinanceService";
import { tableData } from "./table-data";

function BillingTable({
  locale,
  response,
  languageData,
}: {
  locale: string;
  response: PagedResultDto_BillingDto;
  languageData: FinanceServiceResource;
}) {
  const router = useRouter();
  const columns = tableData.billing.columns(locale, languageData);
  const table = tableData.billing.table(router, languageData);

  return (
    <TanstackTable
      {...table}
      columns={columns}
      data={response.items || []}
      rowCount={response.totalCount}
    />
  );
}
export default BillingTable;
