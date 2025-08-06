"use client";

import type {PagedResultDto_TaxFreeListResponseDto} from "@ayasofyazilim/unirefund-saas-dev/CRMService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import {useParams, useRouter} from "next/navigation";
import {useGrantedPolicies} from "@repo/utils/policies";
import type {CRMServiceServiceResource} from "src/language-data/unirefund/CRMService";
import {tableData} from "./table-data";

function TaxFreesTable({
  taxFrees,
  languageData,
  newLink,
}: {
  taxFrees: PagedResultDto_TaxFreeListResponseDto;
  languageData: CRMServiceServiceResource;
  newLink: string;
}) {
  const {grantedPolicies} = useGrantedPolicies();
  const router = useRouter();
  const {lang} = useParams<{lang: string}>();
  const columns = tableData.taxFrees.columns(lang, languageData);
  const table = tableData.taxFrees.table(languageData, router, grantedPolicies, newLink);

  return <TanstackTable {...table} columns={columns} data={taxFrees.items || []} rowCount={taxFrees.totalCount} />;
}

export default TaxFreesTable;
