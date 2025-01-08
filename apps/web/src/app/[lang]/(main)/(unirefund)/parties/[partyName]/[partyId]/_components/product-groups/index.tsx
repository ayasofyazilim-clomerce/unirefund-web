"use client";

import type { UniRefund_SettingService_ProductGroups_ProductGroupDto } from "@ayasofyazilim/saas/CRMService";
import { SectionLayoutContent } from "@repo/ayasofyazilim-ui/templates/section-layout-v2";

export default function ProductGroups({
  productGroups,
}: {
  productGroups: UniRefund_SettingService_ProductGroups_ProductGroupDto[];
}) {
  return (
    <SectionLayoutContent sectionId="product-groups">
      {productGroups[0].name}
    </SectionLayoutContent>
  );
}
