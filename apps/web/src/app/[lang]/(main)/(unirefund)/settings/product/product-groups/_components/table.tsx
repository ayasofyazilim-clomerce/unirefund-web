"use client";

import type {PagedResultDto_ProductGroupDto} from "@ayasofyazilim/saas/SettingService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import {useGrantedPolicies} from "@repo/utils/policies";
import {useRouter} from "next/navigation";
import {useTenant} from "@/providers/tenant";
import type {SettingServiceResource} from "src/language-data/unirefund/SettingService";
import {tableData} from "./product-groups-table-data";

function ProductGroupsTable({
  response,
  languageData,
}: {
  response: PagedResultDto_ProductGroupDto;
  languageData: SettingServiceResource;
}) {
  const router = useRouter();
  const {localization} = useTenant();
  const {grantedPolicies} = useGrantedPolicies();
  const columns = tableData.productGroups.columns(localization, languageData, grantedPolicies);
  const table = tableData.productGroups.table(languageData, router, grantedPolicies);

  return (
    <div className="mt-6 rounded-md border p-6">
      <TanstackTable {...table} columns={columns} data={response.items || []} rowCount={response.totalCount} />
    </div>
  );
}
export default ProductGroupsTable;
