"use client";

import type {UniRefund_SettingService_ProductGroupMerchants_ProductGroupMerchantRelationDto} from "@ayasofyazilim/saas/CRMService";
import type {UniRefund_SettingService_ProductGroups_ProductGroupDto} from "@ayasofyazilim/saas/SettingService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import {useGrantedPolicies} from "@repo/utils/policies";
import {useParams, useRouter} from "next/navigation";
import type {CRMServiceServiceResource} from "src/language-data/unirefund/CRMService";
import {tableData} from "./product-group-table-data";

export default function ProductGroups({
  languageData,
  productGroupListByMerchant,
  productGroupList,
}: {
  languageData: CRMServiceServiceResource;
  productGroupListByMerchant: UniRefund_SettingService_ProductGroupMerchants_ProductGroupMerchantRelationDto[];
  productGroupList: UniRefund_SettingService_ProductGroups_ProductGroupDto[];
}) {
  const router = useRouter();
  const {lang, partyId} = useParams<{lang: string; partyId: string}>();
  const {grantedPolicies} = useGrantedPolicies();
  const productGroupAssign = productGroupListByMerchant.filter((productGroup) => productGroup.isAssign);

  const columns = tableData.productGroups.columns(languageData, grantedPolicies, lang);
  const table = tableData.productGroups.table(languageData, router, productGroupList, partyId, grantedPolicies);

  return <TanstackTable {...table} columns={columns} data={productGroupAssign} rowCount={productGroupAssign.length} />;
}
