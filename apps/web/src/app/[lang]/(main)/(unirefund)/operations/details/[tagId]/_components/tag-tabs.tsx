"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { UniRefund_TagService_Tags_TagDetailDto } from "@ayasofyazilim/saas/TagService";
import type { TagServiceResource } from "src/language-data/unirefund/TagService";
import PurchaseDetailsTable from "./purchase-details/table";

function TagTabs({
  tagDetail,
  languageData,
}: {
  tagDetail: UniRefund_TagService_Tags_TagDetailDto;
  languageData: TagServiceResource;
}) {
  return (
    <Tabs defaultValue="account">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">
          {languageData.PurchaseDetails}
        </TabsTrigger>
        <TabsTrigger value="password">{languageData.TagHistory}</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card className="min-h-0 flex-1 rounded-none p-0">
          <PurchaseDetailsTable
            languageData={languageData}
            tagDetail={tagDetail}
            tagNo={tagDetail.id || ""}
          />
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card className="h-32 min-h-0 flex-1 rounded-none py-6">
          <CardContent>{languageData.NoHistoryFound}</CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

export default TagTabs;
