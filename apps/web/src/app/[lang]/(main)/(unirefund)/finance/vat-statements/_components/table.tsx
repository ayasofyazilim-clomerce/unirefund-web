"use client";

import type {PagedResultDto_VATStatementHeaderForListDto} from "@repo/saas/FinanceService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import {useRouter} from "next/navigation";
import {useGrantedPolicies} from "@repo/utils/policies";
import type {FinanceServiceResource} from "src/language-data/unirefund/FinanceService";
import {tableData} from "./vat-statements-table-data";

function VatStatementTable({
  locale,
  response,
  languageData,
}: {
  locale: string;
  response: PagedResultDto_VATStatementHeaderForListDto;
  languageData: FinanceServiceResource;
}) {
  const router = useRouter();
  const {grantedPolicies} = useGrantedPolicies();
  const columns = tableData.vatStatements.columns(locale, languageData, grantedPolicies);
  const table = tableData.vatStatements.table(languageData, router, grantedPolicies);

  return <TanstackTable {...table} columns={columns} data={response.items || []} rowCount={response.totalCount} />;
}
export default VatStatementTable;
