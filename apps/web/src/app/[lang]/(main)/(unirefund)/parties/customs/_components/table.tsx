"use client";

import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import type {PagedResultDto_CustomListResponseDto} from "@repo/saas/CRMService";
import {useGrantedPolicies} from "@repo/utils/policies";
import {useRouter} from "next/navigation";
import {useTenant} from "@/providers/tenant";
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
  const {localization} = useTenant();
  const columns = tableData.customs.columns(localization, languageData);
  const table = tableData.customs.table(languageData, router, grantedPolicies, newLink);

  return <TanstackTable {...table} columns={columns} data={customs.items || []} rowCount={customs.totalCount} />;
}

export default CustomsTable;
