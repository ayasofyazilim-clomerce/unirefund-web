"use client";
import type {UniRefund_ContractService_Refunds_RefundFeeHeaders_RefundFeeHeaderDto} from "@repo/saas/ContractService";
import type {UniRefund_CRMService_RefundPoints_RefundPointListResponseDto as RefundPointProfileDto} from "@ayasofyazilim/unirefund-saas-dev/CRMService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import {useRouter} from "next/navigation";
import {useGrantedPolicies} from "@repo/utils/policies";
import type {ContractServiceResource} from "@/language-data/unirefund/ContractService";
import {tableData} from "./table-data";

function Table({
  languageData,
  refundFeeHeaders,
  lang,
  refundPoints,
}: {
  lang: string;
  refundFeeHeaders: UniRefund_ContractService_Refunds_RefundFeeHeaders_RefundFeeHeaderDto[];
  languageData: ContractServiceResource;
  refundPoints: RefundPointProfileDto[];
}) {
  const router = useRouter();
  const {grantedPolicies} = useGrantedPolicies();

  const columns = tableData.refundFeeHeaders.columns(lang, refundPoints, languageData);
  const table = tableData.refundFeeHeaders.table({languageData, router, grantedPolicies, refundPoints});

  return (
    <div className="mt-6 rounded-md border p-6">
      <TanstackTable {...table} columns={columns} data={refundFeeHeaders} rowCount={refundFeeHeaders.length} />
    </div>
  );
}

export default Table;
