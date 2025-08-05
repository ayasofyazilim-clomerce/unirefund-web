"use client";

import {PagedResultDto_RefundPointListResponseDto} from "@ayasofyazilim/unirefund-saas-dev/CRMService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import {useParams, useRouter} from "next/navigation";
import {useGrantedPolicies} from "@repo/utils/policies";
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
  const {lang} = useParams<{lang: string}>();
  const columns = tableData.refundPoints.columns(lang, languageData);
  const table = tableData.refundPoints.table(languageData, router, grantedPolicies, newLink);

  return (
    <TanstackTable {...table} columns={columns} data={refundPoints.items || []} rowCount={refundPoints.totalCount} />
  );
}

export default RefundPointsTable;
