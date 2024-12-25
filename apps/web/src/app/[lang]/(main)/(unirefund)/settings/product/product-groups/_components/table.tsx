"use client";

import type { PagedResultDto_ProductGroupDto } from "@ayasofyazilim/saas/SettingService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import { useParams, useRouter } from "next/navigation";
import type { SettingServiceResource } from "src/language-data/unirefund/SettingService";
import { useGrantedPolicies } from "src/providers/granted-policies";
import { tableData } from "./product-groups-table-data";

function ProductGroupsTable({
  response,
  languageData,
}: {
  response: PagedResultDto_ProductGroupDto;
  languageData: SettingServiceResource;
}) {
  const router = useRouter();
  const { lang } = useParams<{ lang: string }>();
  const { grantedPolicies } = useGrantedPolicies();
  const columns = tableData.productGroups.columns(
    lang,
    languageData,
    grantedPolicies,
  );
  const table = tableData.productGroups.table(
    languageData,
    router,
    grantedPolicies,
  );

  return (
    <TanstackTable
      {...table}
      columns={columns}
      data={response.items || []}
      rowCount={response.totalCount}
    />
  );
}
export default ProductGroupsTable;
