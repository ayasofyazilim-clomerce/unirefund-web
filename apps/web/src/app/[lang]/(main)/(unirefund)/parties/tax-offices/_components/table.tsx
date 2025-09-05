"use client";

import type {PagedResultDto_TaxOfficeListResponseDto} from "@repo/saas/CRMService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import {useParams, useRouter} from "next/navigation";
import {useGrantedPolicies} from "@repo/utils/policies";
import type {CRMServiceServiceResource} from "src/language-data/unirefund/CRMService";
import {tableData} from "./table-data";

function TaxOfficesTable({
  taxOffices,
  languageData,
  newLink,
}: {
  taxOffices: PagedResultDto_TaxOfficeListResponseDto;
  languageData: CRMServiceServiceResource;
  newLink: string;
}) {
  const {grantedPolicies} = useGrantedPolicies();
  const router = useRouter();
  const {lang} = useParams<{lang: string}>();
  const columns = tableData.taxOffices.columns(lang, languageData);
  const table = tableData.taxOffices.table(languageData, router, grantedPolicies, newLink);

  return <TanstackTable {...table} columns={columns} data={taxOffices.items || []} rowCount={taxOffices.totalCount} />;
}

export default TaxOfficesTable;
