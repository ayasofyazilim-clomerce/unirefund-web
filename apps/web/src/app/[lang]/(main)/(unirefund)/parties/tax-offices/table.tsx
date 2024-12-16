"use client";

import type { PagedResultDto_TaxOfficeProfileDto } from "@ayasofyazilim/saas/CRMService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import { useParams, useRouter } from "next/navigation";
import type { CRMServiceServiceResource } from "src/language-data/unirefund/CRMService";
import useGrantedPolicies from "src/hooks/use-granted-policies";
import { tableData } from "./tax-offices-table-data";

function TaxOfficesTable({
  response,
  languageData,
}: {
  response: PagedResultDto_TaxOfficeProfileDto;
  languageData: CRMServiceServiceResource;
}) {
  const grantedPolicies = useGrantedPolicies();
  const router = useRouter();
  const { lang } = useParams<{ lang: string }>();
  const columns = tableData.taxOffices.columns(
    lang,
    languageData,
    grantedPolicies,
  );
  const table = tableData.taxOffices.table(
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

export default TaxOfficesTable;
