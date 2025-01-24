"use client";

import type { UniRefund_SettingService_ProductGroupMerchants_ProductGroupMerchantRelationDto } from "@ayasofyazilim/saas/CRMService";
import type { UniRefund_SettingService_ProductGroups_ProductGroupDto } from "@ayasofyazilim/saas/SettingService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import { useParams, useRouter } from "next/navigation";
import type { CRMServiceServiceResource } from "src/language-data/unirefund/CRMService";
import { tableData } from "./product-group-table-data";

export default function ProductGroups({
  languageData,
  response,
  productGroupList,
}: {
  languageData: CRMServiceServiceResource;
  response: UniRefund_SettingService_ProductGroupMerchants_ProductGroupMerchantRelationDto[];
  productGroupList: UniRefund_SettingService_ProductGroups_ProductGroupDto[];
}) {
  const router = useRouter();
  const { lang, partyId } = useParams<{ lang: string; partyId: string }>();
  const productGroupAssign = response.filter(
    (productGroup) => productGroup.isAssign,
  );

  const columns = tableData.productGroups.columns(languageData, lang);
  const table = tableData.productGroups.table(
    languageData,
    router,
    productGroupList,
    partyId,
  );

  return (
    <TanstackTable
      {...table}
      columns={columns}
      data={productGroupAssign}
      rowCount={productGroupAssign.length}
    />
  );
}
