"use client";

import type {PagedResultDto_EntityChangeDto} from "@ayasofyazilim/core-saas/AdministrationService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import {useTenant} from "@/providers/tenant";
import type {AdministrationServiceResource} from "src/language-data/core/AdministrationService";
import {tableData} from "./entity-changes-table-data";

function EntityChangesTable({
  response,
  languageData,
}: {
  response: PagedResultDto_EntityChangeDto;
  languageData: AdministrationServiceResource;
}) {
  const {localization} = useTenant();
  const columns = tableData.entityChanges.columns(localization, languageData);
  const table = tableData.entityChanges.table(languageData);

  return <TanstackTable {...table} columns={columns} data={response.items || []} rowCount={response.totalCount} />;
}
export default EntityChangesTable;
