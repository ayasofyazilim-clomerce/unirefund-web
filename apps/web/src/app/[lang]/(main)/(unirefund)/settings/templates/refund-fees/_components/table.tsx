"use client";
import type {UniRefund_ContractService_Refunds_RefundFeeHeaders_RefundFeeHeaderDto} from "@ayasofyazilim/saas/ContractService";
import type {UniRefund_CRMService_RefundPoints_RefundPointProfileDto as RefundPointProfileDto} from "@ayasofyazilim/saas/CRMService";
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

  const columns = tableData.refundFeeHeaders.columns(lang, {
    name: languageData.Name,
    creationTime: languageData.CreationTime,
    lastModificationTime: languageData.LastModificationTime,
    isDefault: languageData.IsDefault,
    isDeleted: languageData.IsDeleted,
    isActive: languageData.IsActive,
  });
  const table = tableData.refundFeeHeaders.table({languageData, router, grantedPolicies, refundPoints});

  return <TanstackTable {...table} columns={columns} data={refundFeeHeaders} rowCount={refundFeeHeaders.length} />;
}

export default Table;
