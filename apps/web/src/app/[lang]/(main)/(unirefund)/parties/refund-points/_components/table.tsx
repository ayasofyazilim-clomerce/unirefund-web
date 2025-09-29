"use client";

import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import type {PagedResultDto_RefundPointListResponseDto} from "@repo/saas/CRMService";
import {useGrantedPolicies} from "@repo/utils/policies";
import {useRouter} from "next/navigation";
import {useTenant} from "@/providers/tenant";
import type {CRMServiceServiceResource} from "src/language-data/unirefund/CRMService";
import {tableData} from "./table-data";

function RefundPointsTable({
  refundPoints,
  languageData,
  newLink,
}: {
  refundPoints: PagedResultDto_RefundPointListResponseDto;
  languageData: CRMServiceServiceResource;
  newLink: string;
}) {
  const {grantedPolicies} = useGrantedPolicies();
  const router = useRouter();
  const {localization} = useTenant();
  const columns = tableData.refundPoints.columns(localization, languageData);
  const table = tableData.refundPoints.table(languageData, router, grantedPolicies, newLink);

  return (
    <TanstackTable {...table} columns={columns} data={refundPoints.items || []} rowCount={refundPoints.totalCount} />
  );
}

export default RefundPointsTable;
