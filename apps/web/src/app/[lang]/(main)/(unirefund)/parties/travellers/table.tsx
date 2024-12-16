"use client";

import type { PagedResultDto_TravellerListProfileDto } from "@ayasofyazilim/saas/TravellerService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import { useParams, useRouter } from "next/navigation";
import type { TravellerServiceResource } from "src/language-data/unirefund/TravellerService";
import useGrantedPolicies from "src/hooks/use-granted-policies";
import type { CountryDto } from "../../../../../../actions/unirefund/LocationService/types";
import { tableData } from "./travellers-table-data";

function TravellersTable({
  response,
  languageData,
  countryList,
}: {
  response: PagedResultDto_TravellerListProfileDto;
  languageData: TravellerServiceResource;
  countryList: CountryDto[];
}) {
  const grantedPolicies = useGrantedPolicies();
  const router = useRouter();
  const { lang } = useParams<{ lang: string }>();
  const columns = tableData.travellers.columns(
    lang,
    languageData,
    grantedPolicies,
  );
  const table = tableData.travellers.table(
    languageData,
    router,
    countryList,
    grantedPolicies,
  );

  return (
    <TanstackTable
      {...table}
      columns={columns}
      data={response.items || []}
      rowCount={response.totalCount}
    />
  );
}

export default TravellersTable;
