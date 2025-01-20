"use client";

import type { UniRefund_SettingService_ProductGroupMerchants_ProductGroupMerchantRelationDto } from "@ayasofyazilim/saas/CRMService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import { SectionLayoutContent } from "@repo/ayasofyazilim-ui/templates/section-layout-v2";
import { useParams, useRouter } from "next/navigation";
import type { UniRefund_SettingService_ProductGroups_ProductGroupDto } from "@ayasofyazilim/saas/SettingService";
import type { CRMServiceServiceResource } from "src/language-data/unirefund/CRMService";
import { tableData } from "./product-group-table-data";

export default function ProductGroups({
  languageData,
  merchantProductGroupsList,
  productGroupsList,
}: {
  languageData: CRMServiceServiceResource;
  merchantProductGroupsList: UniRefund_SettingService_ProductGroupMerchants_ProductGroupMerchantRelationDto[];
  productGroupsList: UniRefund_SettingService_ProductGroups_ProductGroupDto[];
}) {
  const router = useRouter();
  const { lang, partyId } = useParams<{ lang: string; partyId: string }>();
  const productGroupAssign = merchantProductGroupsList.filter(
    (productGroup) => productGroup.isAssign,
  );

  const columns = tableData.productGroups.columns(languageData, lang);
  const table = tableData.productGroups.table(
    languageData,
    router,
    productGroupsList,
    partyId,
  );

  return (
    <SectionLayoutContent sectionId="product-groups">
      <TanstackTable
        {...table}
        columns={columns}
        data={productGroupAssign}
        rowCount={productGroupAssign.length}
      />
    </SectionLayoutContent>
  );
}
