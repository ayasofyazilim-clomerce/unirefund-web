"use client";

import type {PagedResultDto_TaxOfficeProfileDto} from "@ayasofyazilim/saas/CRMService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import {useParams, useRouter} from "next/navigation";
import {useGrantedPolicies} from "@repo/utils/policies";
import type {CRMServiceServiceResource} from "src/language-data/unirefund/CRMService";
import {tableData} from "./tax-offices-table-data";

function TaxOfficesTable({
  response,
  languageData,
}: {
  response: PagedResultDto_TaxOfficeProfileDto;
  languageData: CRMServiceServiceResource;
}) {
  const {grantedPolicies} = useGrantedPolicies();
  const router = useRouter();
  const {lang} = useParams<{lang: string}>();
  const columns = tableData.taxOffices.columns(lang, languageData, grantedPolicies);
  const table = tableData.taxOffices.table(languageData, router, grantedPolicies);

  return (
    <div className="mt-6 rounded-md border p-6">
      <TanstackTable {...table} columns={columns} data={response.items || []} rowCount={response.totalCount} />
    </div>
  );
}

export default TaxOfficesTable;
