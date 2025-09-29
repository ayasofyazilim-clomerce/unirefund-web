"use client";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import type {PagedResultDto_FileTypeListDto} from "@repo/saas/FileService";
import {useGrantedPolicies} from "@repo/utils/policies";
import {useRouter} from "next/navigation";
import {useTenant} from "@/providers/tenant";
import type {DefaultResource} from "@/language-data/core/Default";
import {tableData} from "./file-type-table-data";

function FileTypeTable({
  languageData,
  response,
}: {
  locale: string;
  languageData: DefaultResource;
  response: PagedResultDto_FileTypeListDto;
}) {
  const router = useRouter();
  const {localization} = useTenant();
  const {grantedPolicies} = useGrantedPolicies();
  const columns = tableData.fileType.columns(localization);
  const table = tableData.fileType.table(languageData, router, grantedPolicies, localization);
  return <TanstackTable {...table} columns={columns} data={response.items || []} rowCount={response.totalCount} />;
}

export default FileTypeTable;
