"use client";

import type { PagedResultDto_MerchantProfileDto } from "@ayasofyazilim/saas/CRMService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import { useParams, useRouter } from "next/navigation";
import useGrantedPolicies from "src/hooks/use-granted-policies";
import type { CRMServiceServiceResource } from "src/language-data/unirefund/CRMService";
import { tableData } from "./merchant-table-data";

function MerchantsTable({
  response,
  languageData,
}: {
  response: PagedResultDto_MerchantProfileDto;
  languageData: CRMServiceServiceResource;
}) {
  const grantedPolicies = useGrantedPolicies();
  const router = useRouter();
  const { lang } = useParams<{ lang: string }>();
  const columns = tableData.merchants.columns(
    lang,
    languageData,
    grantedPolicies,
  );
  const table = tableData.merchants.table(
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

export default MerchantsTable;
