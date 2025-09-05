"use client";

import type {PagedResultDto_CustomListResponseDto} from "@repo/saas/CRMService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import {useParams, useRouter} from "next/navigation";
import {useGrantedPolicies} from "@repo/utils/policies";
import type {CRMServiceServiceResource} from "src/language-data/unirefund/CRMService";
import {tableData} from "./table-data";

function CustomsTable({
  customs,
  languageData,
  newLink,
}: {
  customs: PagedResultDto_CustomListResponseDto;
  languageData: CRMServiceServiceResource;
  newLink: string;
}) {
  const {grantedPolicies} = useGrantedPolicies();
  const router = useRouter();
  const {lang} = useParams<{lang: string}>();
  const columns = tableData.customs.columns(lang, languageData);
  const table = tableData.customs.table(languageData, router, grantedPolicies, newLink);

  return <TanstackTable {...table} columns={columns} data={customs.items || []} rowCount={customs.totalCount} />;
}

export default CustomsTable;
