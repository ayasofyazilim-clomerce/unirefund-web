"use client";

import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import type {PagedResultDto_TaxFreeListResponseDto} from "@repo/saas/CRMService";
import {useGrantedPolicies} from "@repo/utils/policies";
import {useRouter} from "next/navigation";
import {useTenant} from "@/providers/tenant";
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

  const {localization} = useTenant();
  const columns = tableData.taxFrees.columns(localization, languageData);
  const table = tableData.taxFrees.table(languageData, router, grantedPolicies, newLink);

  return <TanstackTable {...table} columns={columns} data={taxFrees.items || []} rowCount={taxFrees.totalCount} />;
}

export default TaxFreesTable;
