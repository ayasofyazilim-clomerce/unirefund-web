"use client";

import type {PagedResultDto_RebateStatementHeaderForListDto} from "@repo/saas/FinanceService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import {useParams, useRouter} from "next/navigation";
import {useGrantedPolicies} from "@repo/utils/policies";
import type {FinanceServiceResource} from "src/language-data/unirefund/FinanceService";
import {tableData} from "./rebate-statements-table-data";

function RebateStatementTable({
  response,
  languageData,
}: {
  locale: string;
  response: PagedResultDto_RebateStatementHeaderForListDto;
  languageData: FinanceServiceResource;
}) {
  const router = useRouter();
  const {lang} = useParams<{lang: string}>();
  const {grantedPolicies} = useGrantedPolicies();
  const columns = tableData.rebateStatements.columns(lang, languageData, grantedPolicies);
  const table = tableData.rebateStatements.table(languageData, router, grantedPolicies);

  return <TanstackTable {...table} columns={columns} data={response.items || []} rowCount={response.totalCount} />;
}
export default RebateStatementTable;
