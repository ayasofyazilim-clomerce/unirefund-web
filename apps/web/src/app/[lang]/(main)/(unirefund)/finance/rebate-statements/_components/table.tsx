"use client";

import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import type {PagedResultDto_RebateStatementHeaderForListDto} from "@repo/saas/FinanceService";
import {useGrantedPolicies} from "@repo/utils/policies";
import {useRouter} from "next/navigation";
import {useTenant} from "@/providers/tenant";
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

  const {localization} = useTenant();
  const {grantedPolicies} = useGrantedPolicies();
  const columns = tableData.rebateStatements.columns(localization, languageData, grantedPolicies);
  const table = tableData.rebateStatements.table(languageData, router, grantedPolicies);

  return <TanstackTable {...table} columns={columns} data={response.items || []} rowCount={response.totalCount} />;
}
export default RebateStatementTable;
