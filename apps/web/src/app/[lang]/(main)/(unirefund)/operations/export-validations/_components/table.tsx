"use client";

import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import type {PagedResultDto_ExportValidationDto} from "@repo/saas/ExportValidationService";
import {useGrantedPolicies} from "@repo/utils/policies";
import {useTenant} from "@/providers/tenant";
import type {ExportValidationServiceResource} from "src/language-data/unirefund/ExportValidationService";
import {tableData} from "./export-validations-table-data";

function ExportValidationTable({
  response,
  languageData,
}: {
  response: PagedResultDto_ExportValidationDto;
  languageData: ExportValidationServiceResource;
}) {
  const {localization} = useTenant();
  const {grantedPolicies} = useGrantedPolicies();
  const columns = tableData.exportValidations.columns(localization, languageData, grantedPolicies);
  const table = tableData.exportValidations.table(languageData);

  return <TanstackTable {...table} columns={columns} data={response.items || []} rowCount={response.totalCount} />;
}
export default ExportValidationTable;
