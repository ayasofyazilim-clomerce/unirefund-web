"use client";
import type {PagedResultDto_FileRelationEntityListDto} from "@repo/saas/FileService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import {useGrantedPolicies} from "@repo/utils/policies";
import {useRouter} from "next/navigation";
import type {DefaultResource} from "@/language-data/core/Default";
import {tableData} from "./file-relation-entity-table-data";

function FileRelationEntitiesTable({
  locale,
  languageData,
  response,
}: {
  locale: string;
  languageData: DefaultResource;
  response: PagedResultDto_FileRelationEntityListDto;
}) {
  const router = useRouter();
  const {grantedPolicies} = useGrantedPolicies();
  const columns = tableData.fileRelationEntity.columns(locale);
  const table = tableData.fileRelationEntity.table(languageData, router, grantedPolicies, locale);
  return <TanstackTable {...table} columns={columns} data={response.items || []} rowCount={response.totalCount} />;
}

export default FileRelationEntitiesTable;
