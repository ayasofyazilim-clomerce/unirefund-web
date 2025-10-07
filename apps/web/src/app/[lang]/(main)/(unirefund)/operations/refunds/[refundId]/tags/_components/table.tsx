"use client";

import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import type {GetApiTagServiceTagResponse} from "@repo/saas/TagService";
import {useTenant} from "@/providers/tenant";
import type {TagServiceResource} from "src/language-data/unirefund/TagService";
import {tableData} from "./table-data";

function TaxFreeTagsTable({
  response,
  languageData,
}: {
  response: GetApiTagServiceTagResponse;
  languageData: TagServiceResource;
}) {
  const {localization} = useTenant();
  const columns = tableData.taxFreeTags.columns(localization, languageData);
  const table = tableData.taxFreeTags.table();

  return <TanstackTable {...table} columns={columns} data={response.items || []} rowCount={response.totalCount} />;
}

export default TaxFreeTagsTable;
