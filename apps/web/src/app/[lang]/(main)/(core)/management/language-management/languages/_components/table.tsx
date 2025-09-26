"use client";

import type {PagedResultDto_LanguageDto} from "@ayasofyazilim/core-saas/AdministrationService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import {useGrantedPolicies} from "@repo/utils/policies";
import {useRouter} from "next/navigation";
import {useTenant} from "@/providers/tenant";
import type {AdministrationServiceResource} from "src/language-data/core/AdministrationService";
import {tableData} from "./languages-table-data";

function LanguagesTable({
  response,
  languageData,
}: {
  response: PagedResultDto_LanguageDto;
  languageData: AdministrationServiceResource;
}) {
  const router = useRouter();
  const {localization} = useTenant();
  const {grantedPolicies} = useGrantedPolicies();
  const columns = tableData.languages.columns(localization, languageData);
  const table = tableData.languages.table(languageData, router, grantedPolicies);

  return (
    <div className="mt-6 rounded-md border p-6">
      <TanstackTable {...table} columns={columns} data={response.items || []} rowCount={response.totalCount} />
    </div>
  );
}
export default LanguagesTable;
