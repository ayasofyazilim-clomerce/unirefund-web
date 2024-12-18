"use client";

import type { PagedResultDto_VATStatementHeaderForListDto } from "@ayasofyazilim/saas/FinanceService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import type { FinanceServiceResource } from "src/language-data/unirefund/FinanceService";
import { useGrantedPolicies } from "src/providers/granted-policies";
import { tableData } from "./vat-statements-table-data";

function VatStatementTable({
  locale,
  response,
  languageData,
}: {
  locale: string;
  response: PagedResultDto_VATStatementHeaderForListDto;
  languageData: FinanceServiceResource;
}) {
  const { grantedPolicies } = useGrantedPolicies();
  const columns = tableData.vatStatements.columns(
    locale,
    languageData,
    grantedPolicies,
  );
  const table = tableData.vatStatements.table();

  return (
    <TanstackTable
      {...table}
      columns={columns}
      data={response.items || []}
      rowCount={response.totalCount}
    />
  );
}
export default VatStatementTable;
