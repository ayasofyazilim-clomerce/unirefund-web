"use client";

import type { PagedResultDto_VATStatementHeaderForListDto } from "@ayasofyazilim/saas/FinanceService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import type { FinanceServiceResource } from "src/language-data/unirefund/FinanceService";
import { tableData } from "./vat-statements-table-data";

function BillingTable({
  locale,
  response,
  languageData,
}: {
  locale: string;
  response: PagedResultDto_VATStatementHeaderForListDto;
  languageData: FinanceServiceResource;
}) {
  const columns = tableData.billing.columns(locale, languageData);
  const table = tableData.billing.table();

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
