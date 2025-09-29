"use client";
import type {PagedResultDto_MimeTypeListDto} from "@repo/saas/FileService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import {useGrantedPolicies} from "@repo/utils/policies";
import {useRouter} from "next/navigation";
import type {DefaultResource} from "@/language-data/core/Default";
import {useTenant} from "@/providers/tenant";
import {tableData} from "./mime-type-table-data";

function MimeTypesTable({
  languageData,
  response,
}: {
  locale: string;
  languageData: DefaultResource;
  response: PagedResultDto_MimeTypeListDto;
}) {
  const router = useRouter();
  const {localization} = useTenant();
  const {grantedPolicies} = useGrantedPolicies();
  const columns = tableData.mimeTypes.columns(localization);
  const table = tableData.mimeTypes.table(languageData, router, grantedPolicies);
  return <TanstackTable {...table} columns={columns} data={response.items || []} rowCount={response.totalCount} />;
}

export default MimeTypesTable;
