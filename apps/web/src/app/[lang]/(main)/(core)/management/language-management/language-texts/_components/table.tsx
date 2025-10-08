"use client";

import type {
  PagedResultDto_LanguageTextDto,
  Volo_Abp_LanguageManagement_Dto_LanguageDto,
  Volo_Abp_LanguageManagement_Dto_LanguageResourceDto,
} from "@ayasofyazilim/core-saas/AdministrationService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import {useGrantedPolicies} from "@repo/utils/policies";
import {useRouter} from "next/navigation";
import {useTenant} from "@/providers/tenant";
import type {AdministrationServiceResource} from "src/language-data/core/AdministrationService";
import {tableData} from "./language-texts-table-data";

function LanguageTextsTable({
  response,
  languageData,
  languageList,
  languagesResourcesData,
}: {
  response: PagedResultDto_LanguageTextDto;
  languageData: AdministrationServiceResource;
  languageList: Volo_Abp_LanguageManagement_Dto_LanguageDto[];
  languagesResourcesData: Volo_Abp_LanguageManagement_Dto_LanguageResourceDto[];
}) {
  const {localization} = useTenant();
  const router = useRouter();
  const {grantedPolicies} = useGrantedPolicies();
  const columns = tableData.languageTexts.columns(localization, languageData);
  const table = tableData.languageTexts.table(
    languageData,
    languageList,
    languagesResourcesData,
    grantedPolicies,
    router,
  );

  return (
    <div className="mt-6 rounded-md border p-1 md:p-6">
      <TanstackTable {...table} columns={columns} data={response.items || []} rowCount={response.totalCount} />
    </div>
  );
}
export default LanguageTextsTable;
