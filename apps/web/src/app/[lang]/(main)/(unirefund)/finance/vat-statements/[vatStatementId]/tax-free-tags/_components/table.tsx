"use client";

import type {UniRefund_FinanceService_VATStatementHeaders_VATStatementHeaderDetailDto} from "@ayasofyazilim/saas/FinanceService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import {useGrantedPolicies} from "@repo/utils/policies";
import {useParams} from "next/navigation";
import type {FinanceServiceResource} from "src/language-data/unirefund/FinanceService";
import {tableData} from "./tax-free-tag-table-data";

function TaxFreeTagTable({
  languageData,
  taxFreeTagsData,
}: {
  taxFreeTagsData: UniRefund_FinanceService_VATStatementHeaders_VATStatementHeaderDetailDto;
  languageData: FinanceServiceResource;
}) {
  const {grantedPolicies} = useGrantedPolicies();
  const {lang} = useParams<{lang: string}>();

  const columns = tableData.TaxFreeTag.columns(lang, languageData, grantedPolicies);
  const table = tableData.TaxFreeTag.table();

  return (
    <TanstackTable {...table} columns={columns} data={taxFreeTagsData.vatStatementTagDetails || []} rowCount={1} />
  );
}

export default TaxFreeTagTable;
