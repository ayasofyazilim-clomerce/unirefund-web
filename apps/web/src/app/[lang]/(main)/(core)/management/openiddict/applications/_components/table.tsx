"use client";

import type {PagedResultDto_ApplicationDto} from "@ayasofyazilim/saas/IdentityService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import {useParams, useRouter} from "next/navigation";
import {useGrantedPolicies} from "@repo/utils/policies";
import type {IdentityServiceResource} from "src/language-data/core/IdentityService";
import {tableData} from "./applications-table-data";

function ApplicationsTable({
  response,
  languageData,
}: {
  response: PagedResultDto_ApplicationDto;
  languageData: IdentityServiceResource;
}) {
  const router = useRouter();
  const {lang} = useParams<{lang: string}>();
  const {grantedPolicies} = useGrantedPolicies();
  const columns = tableData.applications.columns(lang, languageData, grantedPolicies);
  const table = tableData.applications.table(languageData, router, grantedPolicies);

  return <TanstackTable {...table} columns={columns} data={response.items || []} rowCount={response.totalCount} />;
}
export default ApplicationsTable;
