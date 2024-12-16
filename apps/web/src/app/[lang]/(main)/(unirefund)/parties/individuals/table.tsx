"use client";

import type { GetApiCrmServiceIndividualsResponse } from "@ayasofyazilim/saas/CRMService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import { useParams, useRouter } from "next/navigation";
import type { CRMServiceServiceResource } from "src/language-data/unirefund/CRMService";
import useGrantedPolicies from "src/hooks/use-granted-policies";
import { tableData } from "./individuals-table-data";

function IndividualsTable({
  response,
  languageData,
}: {
  response: GetApiCrmServiceIndividualsResponse;
  languageData: CRMServiceServiceResource;
}) {
  const grantedPolicies = useGrantedPolicies();
  const router = useRouter();
  const { lang } = useParams<{ lang: string }>();
  const columns = tableData.individuals.columns(
    lang,
    languageData,
    grantedPolicies,
  );
  const table = tableData.individuals.table(
    languageData,
    router,
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

export default IndividualsTable;
