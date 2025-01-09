"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { UniRefund_SettingService_ProductGroups_ProductGroupDto } from "@ayasofyazilim/saas/SettingService";
import type { UniRefund_TagService_Tags_TagDetailDto } from "@ayasofyazilim/saas/TagService";
import type { TagServiceResource } from "src/language-data/unirefund/TagService";
import PurchaseDetailsTable from "./purchase-details/table";

function TagTabs({
  tagDetail,
  languageData,
  productGroups,
}: {
  tagDetail: UniRefund_TagService_Tags_TagDetailDto;
  languageData: TagServiceResource;
  productGroups: UniRefund_SettingService_ProductGroups_ProductGroupDto[];
}) {
  return (
    <Tabs defaultValue="purchase-details">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="purchase-details">
          {languageData.PurchaseDetails}
        </TabsTrigger>
        <TabsTrigger value="tag-history">{languageData.TagHistory}</TabsTrigger>
      </TabsList>
      <TabsContent value="purchase-details">
        <Card className="min-h-0 flex-1 rounded-none p-0">
          <PurchaseDetailsTable
            languageData={languageData}
            productGroups={productGroups}
            tagDetail={tagDetail}
            tagNo={tagDetail.id || ""}
          />
        </Card>
      </TabsContent>
      <TabsContent value="tag-history">
        <Card className="h-32 min-h-0 flex-1 rounded-none py-6">
          <CardContent>{languageData.NoHistoryFound}</CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

export default TagTabs;
