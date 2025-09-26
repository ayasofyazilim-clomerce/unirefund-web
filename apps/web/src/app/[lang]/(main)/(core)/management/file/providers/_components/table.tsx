"use client";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import type {PagedResultDto_ProviderListDto} from "@repo/saas/FileService";
import {useGrantedPolicies} from "@repo/utils/policies";
import {useRouter} from "next/navigation";
import {useTenant} from "@/providers/tenant";
import type {DefaultResource} from "@/language-data/core/Default";
import {tableData} from "./providers-table-data";

function ProviderTable({
  languageData,
  response,
}: {
  languageData: DefaultResource;
  response: PagedResultDto_ProviderListDto;
}) {
  const router = useRouter();
  const {localization} = useTenant();
  const {grantedPolicies} = useGrantedPolicies();
  const columns = tableData.providers.columns(localization);
  const table = tableData.providers.table(languageData, router, grantedPolicies);
  return <TanstackTable {...table} columns={columns} data={response.items || []} rowCount={response.totalCount} />;
}

export default ProviderTable;
