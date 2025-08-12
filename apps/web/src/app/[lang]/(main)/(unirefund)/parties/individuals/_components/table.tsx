"use client";

import type {PagedResultDto_IndividualListResponseDto} from "@ayasofyazilim/unirefund-saas-dev/CRMService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import {useParams, useRouter} from "next/navigation";
import {useGrantedPolicies} from "@repo/utils/policies";
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
  const {lang} = useParams<{lang: string}>();
  const columns = tableData.individuals.columns(lang, languageData);
  const table = tableData.individuals.table(languageData, router, grantedPolicies, newLink);

  return (
    <TanstackTable {...table} columns={columns} data={individuals.items || []} rowCount={individuals.totalCount} />
  );
}

export default IndividualsTable;
