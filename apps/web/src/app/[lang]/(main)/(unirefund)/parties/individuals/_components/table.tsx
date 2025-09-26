"use client";

import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import type {PagedResultDto_IndividualListResponseDto} from "@repo/saas/CRMService";
import {useGrantedPolicies} from "@repo/utils/policies";
import {useRouter} from "next/navigation";
import {useTenant} from "@/providers/tenant";
import type {CRMServiceServiceResource} from "src/language-data/unirefund/CRMService";
import {tableData} from "./table-data";

function IndividualsTable({
  individuals,
  languageData,
  newLink,
}: {
  individuals: PagedResultDto_IndividualListResponseDto;
  languageData: CRMServiceServiceResource;
  newLink: string;
}) {
  const {grantedPolicies} = useGrantedPolicies();
  const router = useRouter();
  const {localization} = useTenant();
  const columns = tableData.individuals.columns(localization, languageData);
  const table = tableData.individuals.table(languageData, router, grantedPolicies, newLink);

  return (
    <TanstackTable {...table} columns={columns} data={individuals.items || []} rowCount={individuals.totalCount} />
  );
}

export default IndividualsTable;
