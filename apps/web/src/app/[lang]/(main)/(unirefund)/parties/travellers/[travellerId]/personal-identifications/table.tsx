"use client";

import type { UniRefund_TravellerService_Travellers_TravellerDetailProfileDto } from "@ayasofyazilim/saas/TravellerService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import { useGrantedPolicies } from "@repo/utils/policies";
import { useParams, useRouter } from "next/navigation";
import type { TravellerServiceResource } from "src/language-data/unirefund/TravellerService";
import { tableData } from "./identification-table-data";

function PersonalIdentificationTable({
  response,
  languageData,
}: {
  response: UniRefund_TravellerService_Travellers_TravellerDetailProfileDto["personalIdentifications"];
  languageData: TravellerServiceResource;
}) {
  const { grantedPolicies } = useGrantedPolicies();
  const router = useRouter();
  const { lang, travellerId } = useParams<{
    lang: string;
    travellerId: string;
  }>();

  const columns = tableData.identifications.columns(
    lang,
    languageData,
    grantedPolicies,
    travellerId,
  );
  const table = tableData.identifications.table(
    languageData,
    router,
    grantedPolicies,
    travellerId,
  );

  return (
    <TanstackTable
      {...table}
      columns={columns}
      data={response}
      rowCount={response.length}
    />
  );
}

export default PersonalIdentificationTable;
