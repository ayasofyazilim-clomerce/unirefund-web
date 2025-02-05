"use client";

import type {GetApiCrmServiceTaxOfficesByIdSubTaxOfficesResponse} from "@ayasofyazilim/saas/CRMService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import {useGrantedPolicies} from "@repo/utils/policies";
import {useParams, useRouter} from "next/navigation";
import type {CRMServiceServiceResource} from "src/language-data/unirefund/CRMService";
import {tableData} from "./sub-store-table-data";

function SubStoresTable({
  response,
  languageData,
}: {
  response: GetApiCrmServiceTaxOfficesByIdSubTaxOfficesResponse;
  languageData: CRMServiceServiceResource;
}) {
  const {grantedPolicies} = useGrantedPolicies();
  const router = useRouter();
  const {lang, partyId} = useParams<{lang: string; partyId: string}>();
  const columns = tableData.subStores.columns(lang, languageData, grantedPolicies);
  const table = tableData.subStores.table(languageData, router, grantedPolicies, partyId);

  return <TanstackTable {...table} columns={columns} data={response.items || []} rowCount={response.totalCount} />;
}

export default SubStoresTable;
