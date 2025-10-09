"use client";

import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import type {PagedResultDto_TravellerListDto} from "@repo/saas/TravellerService";
import {useGrantedPolicies} from "@repo/utils/policies";
import {useRouter} from "next/navigation";
import type {CountryDto} from "@/utils/address-hook/types";
import {useTenant} from "@/providers/tenant";
import type {TravellerServiceResource} from "src/language-data/unirefund/TravellerService";
import {tableData} from "./travellers-table-data";

function TravellersTable({
  response,
  languageData,
  countryList,
}: {
  response: PagedResultDto_TravellerListDto;
  languageData: TravellerServiceResource;
  countryList: CountryDto[];
}) {
  const {grantedPolicies} = useGrantedPolicies();
  const router = useRouter();

  const {localization} = useTenant();
  const columns = tableData.travellers.columns(localization, languageData, grantedPolicies);
  const table = tableData.travellers.table(languageData, router, countryList, grantedPolicies);

  return (
    <div className="mt-6 rounded-md border p-1 md:p-6">
      <TanstackTable {...table} columns={columns} data={response.items || []} rowCount={response.totalCount} />
    </div>
  );
}

export default TravellersTable;
