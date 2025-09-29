"use client";
import type {PagedResultDto_RebateTableHeaderListDto} from "@repo/saas/ContractService";
import type {UniRefund_CRMService_Merchants_MerchantListResponseDto as MerchantProfileDto} from "@repo/saas/CRMService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import {useGrantedPolicies} from "@repo/utils/policies";
import {useRouter} from "next/navigation";
import type {ContractServiceResource} from "src/language-data/unirefund/ContractService";
import {useTenant} from "@/providers/tenant";
import {tableData} from "./table-data";

export default function RebateTable({
  languageData,
  rebateTableHeaders,
  merchants,
}: {
  languageData: ContractServiceResource;
  rebateTableHeaders: PagedResultDto_RebateTableHeaderListDto;
  lang: string;
  merchants: MerchantProfileDto[];
}) {
  const router = useRouter();
  const {localization} = useTenant();
  const {grantedPolicies} = useGrantedPolicies();
  const columns = tableData.rebateTableHeaders.columns(localization, merchants, languageData);
  const table = tableData.rebateTableHeaders.table({languageData, router, grantedPolicies, merchants});
  return (
    <div className="mt-6 rounded-md border p-6">
      <TanstackTable
        {...table}
        columns={columns}
        data={rebateTableHeaders.items || []}
        rowCount={rebateTableHeaders.totalCount}
      />
    </div>
  );
}
