"use client";

import type {GetApiTagServiceTagResponse} from "@repo/saas/TagService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import {useParams} from "next/navigation";
import type {TagServiceResource} from "src/language-data/unirefund/TagService";
import {tableData} from "./table-data";

function TaxFreeTagsTable({
  response,
  languageData,
}: {
  response: GetApiTagServiceTagResponse;
  languageData: TagServiceResource;
}) {
  const {lang} = useParams<{lang: string}>();
  const columns = tableData.taxFreeTags.columns(lang, languageData);
  const table = tableData.taxFreeTags.table();

  return <TanstackTable {...table} columns={columns} data={response.items || []} rowCount={response.totalCount} />;
}

export default TaxFreeTagsTable;
