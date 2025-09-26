"use client";

import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import type {PagedResultDto_TaxOfficeListResponseDto} from "@repo/saas/CRMService";
import {useGrantedPolicies} from "@repo/utils/policies";
import {useRouter} from "next/navigation";
import {useTenant} from "@/providers/tenant";
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

  const {localization} = useTenant();
  const columns = tableData.taxOffices.columns(localization, languageData);
  const table = tableData.taxOffices.table(languageData, router, grantedPolicies, newLink);

  return <TanstackTable {...table} columns={columns} data={taxOffices.items || []} rowCount={taxOffices.totalCount} />;
}

export default TaxOfficesTable;
