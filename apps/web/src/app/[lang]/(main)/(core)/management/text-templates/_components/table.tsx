"use client";

import type {PagedResultDto_TemplateDefinitionDto} from "@ayasofyazilim/core-saas/AdministrationService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import {useTenant} from "@/providers/tenant";
import type {AdministrationServiceResource} from "src/language-data/core/AdministrationService";
import {tableData} from "./text-template-table-data";

function TextTemplateTable({
  response,
  languageData,
}: {
  response: PagedResultDto_TemplateDefinitionDto;
  languageData: AdministrationServiceResource;
}) {
  const {localization} = useTenant();
  const columns = tableData.textTemplate.columns(localization, languageData);
  const table = tableData.textTemplate.table();

  return <TanstackTable {...table} columns={columns} data={response.items || []} rowCount={response.totalCount} />;
}
export default TextTemplateTable;
