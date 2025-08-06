"use client";

import type {PagedResultDto_MerchantListResponseDto} from "@ayasofyazilim/unirefund-saas-dev/CRMService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import {useParams, useRouter} from "next/navigation";
import {useGrantedPolicies} from "@repo/utils/policies";
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
  const {lang} = useParams<{lang: string}>();
  const columns = tableData.merchants.columns(lang, languageData);
  const table = tableData.merchants.table(languageData, router, grantedPolicies, newLink);

  return <TanstackTable {...table} columns={columns} data={merchants.items || []} rowCount={merchants.totalCount} />;
}

export default MerchantsTable;
