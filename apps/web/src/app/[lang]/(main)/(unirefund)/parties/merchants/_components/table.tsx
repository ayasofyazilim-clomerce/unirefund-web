"use client";

import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import type {PagedResultDto_MerchantListResponseDto} from "@repo/saas/CRMService";
import {useGrantedPolicies} from "@repo/utils/policies";
import {useRouter} from "next/navigation";
import {useTenant} from "@/providers/tenant";
import type {CRMServiceServiceResource} from "src/language-data/unirefund/CRMService";
import {tableData} from "./table-data";

function MerchantsTable({
  merchants,
  languageData,
  newLink,
}: {
  merchants: PagedResultDto_MerchantListResponseDto;
  languageData: CRMServiceServiceResource;
  newLink: string;
}) {
  const {grantedPolicies} = useGrantedPolicies();
  const router = useRouter();

  const {localization} = useTenant();
  const columns = tableData.merchants.columns(localization, languageData);
  const table = tableData.merchants.table(languageData, router, grantedPolicies, newLink);

  return <TanstackTable {...table} columns={columns} data={merchants.items || []} rowCount={merchants.totalCount} />;
}

export default MerchantsTable;
