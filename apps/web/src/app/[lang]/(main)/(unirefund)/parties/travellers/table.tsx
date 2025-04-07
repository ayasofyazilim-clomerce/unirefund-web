"use client";

import type {PagedResultDto_TravellerListProfileDto} from "@ayasofyazilim/saas/TravellerService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import {useParams, useRouter} from "next/navigation";
import {useGrantedPolicies} from "@repo/utils/policies";
import type {TravellerServiceResource} from "src/language-data/unirefund/TravellerService";
import type {CountryDto} from "@/utils/address-hook/types";
import {tableData} from "./travellers-table-data";

function TravellersTable({
  response,
  languageData,
  countryList,
}: {
  response: PagedResultDto_TravellerListProfileDto;
  languageData: TravellerServiceResource;
  countryList: CountryDto[];
}) {
  const {grantedPolicies} = useGrantedPolicies();
  const router = useRouter();
  const {lang} = useParams<{lang: string}>();
  const columns = tableData.travellers.columns(lang, languageData, grantedPolicies);
  const table = tableData.travellers.table(languageData, router, countryList, grantedPolicies);

  return (
    <div className="mt-6 rounded-md border p-6">
      <TanstackTable {...table} columns={columns} data={response.items || []} rowCount={response.totalCount} />
    </div>
  );
}

export default TravellersTable;
