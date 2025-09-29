"use client";
import type {PagedResultDto_FileTypeGroupListDto} from "@repo/saas/FileService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import {useGrantedPolicies} from "@repo/utils/policies";
import {useRouter} from "next/navigation";
import type {DefaultResource} from "@/language-data/core/Default";
import {useTenant} from "@/providers/tenant";
import {tableData} from "./file-type-group-table-data";

function FileTypeGroupTable({
  languageData,
  response,
}: {
  locale: string;
  languageData: DefaultResource;
  response: PagedResultDto_FileTypeGroupListDto;
}) {
  const router = useRouter();
  const {grantedPolicies} = useGrantedPolicies();
  const {localization} = useTenant();
  const columns = tableData.fileTypeGroup.columns(localization);
  const table = tableData.fileTypeGroup.table(languageData, router, grantedPolicies);
  return <TanstackTable {...table} columns={columns} data={response.items || []} rowCount={response.totalCount} />;
}

export default FileTypeGroupTable;
