"use client";

import type { PagedResultDto_VatDto } from "@ayasofyazilim/saas/SettingService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import { useParams, useRouter } from "next/navigation";
import type { SettingServiceResource } from "src/language-data/unirefund/SettingService";
import { useGrantedPolicies } from "src/providers/granted-policies";
import { tableData } from "./vats-table-data";

function VatsTable({
  response,
  languageData,
}: {
  response: PagedResultDto_VatDto;
  languageData: SettingServiceResource;
}) {
  const router = useRouter();
  const { lang } = useParams<{ lang: string }>();
  const { grantedPolicies } = useGrantedPolicies();
  const columns = tableData.vats.columns(lang, languageData, grantedPolicies);
  const table = tableData.vats.table(languageData, router, grantedPolicies);

  return (
    <TanstackTable
      {...table}
      columns={columns}
      data={response.items || []}
      rowCount={response.totalCount}
    />
  );
}
export default VatsTable;
