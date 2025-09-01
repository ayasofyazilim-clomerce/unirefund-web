"use client";
import type {PagedResultDto_RefundTableHeaderListDto} from "@repo/saas/ContractService";
import type {UniRefund_CRMService_Merchants_MerchantListResponseDto as MerchantProfileDto} from "@ayasofyazilim/unirefund-saas-dev/CRMService";
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
  const columns = tableData.refundTableHeaders.columns(lang, merchants, languageData);
  const table = tableData.refundTableHeaders.table({languageData, router, grantedPolicies, merchants});
  return (
    <div className="mt-6 rounded-md border p-6">
      <TanstackTable
        {...table}
        columns={columns}
        data={refundTableHeaders.items || []}
        rowCount={refundTableHeaders.totalCount}
      />
    </div>
  );
}

export default RefundTable;
