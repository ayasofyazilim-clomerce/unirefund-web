"use client";

import type { PagedResultDto_ExportValidationDto } from "@ayasofyazilim/saas/ExportValidationService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import { useParams } from "next/navigation";
import type { ExportValidationServiceResource } from "src/language-data/unirefund/ExportValidationService";
import { useGrantedPolicies } from "src/providers/granted-policies";
import { tableData } from "./export-validations-table-data";

function ExportValidationTable({
  response,
  languageData,
}: {
  response: PagedResultDto_ExportValidationDto;
  languageData: ExportValidationServiceResource;
}) {
  const { lang } = useParams<{ lang: string }>();
  const { grantedPolicies } = useGrantedPolicies();
  const columns = tableData.exportValidations.columns(
    lang,
    languageData,
    grantedPolicies,
  );
  const table = tableData.exportValidations.table(languageData);

  return (
    <TanstackTable
      {...table}
      columns={columns}
      data={response.items || []}
      rowCount={response.totalCount}
    />
  );
}
export default ExportValidationTable;
