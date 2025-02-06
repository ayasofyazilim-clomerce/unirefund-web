"use client";
import type {PagedResultDto_RefundTableHeaderListDto} from "@ayasofyazilim/saas/ContractService";
import type {UniRefund_CRMService_Merchants_MerchantProfileDto as MerchantProfileDto} from "@ayasofyazilim/saas/CRMService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import {useGrantedPolicies} from "@repo/utils/policies";
import {useRouter} from "next/navigation";
import type {ContractServiceResource} from "src/language-data/unirefund/ContractService";
import {tableData} from "./table-data";

function RefundTable({
  languageData,
  refundTableHeaders,
  lang,
  merchants,
}: {
  languageData: ContractServiceResource;
  refundTableHeaders: PagedResultDto_RefundTableHeaderListDto;
  lang: string;
  merchants: MerchantProfileDto[];
}) {
  const router = useRouter();
  const {grantedPolicies} = useGrantedPolicies();
  const columns = tableData.refundTableHeaders.columns(lang, languageData);
  const table = tableData.refundTableHeaders.table({languageData, router, grantedPolicies, merchants});
  return (
    <TanstackTable
      {...table}
      columns={columns}
      data={refundTableHeaders.items || []}
      rowCount={refundTableHeaders.totalCount}
    />
  );
}

export default RefundTable;
