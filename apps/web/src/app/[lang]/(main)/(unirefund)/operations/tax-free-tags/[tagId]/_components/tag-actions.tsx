"use client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { UniRefund_TagService_Tags_TagDetailDto } from "@ayasofyazilim/saas/TagService";
import { PencilRuler } from "lucide-react";
import { useRouter } from "next/navigation";
import type { TagServiceResource } from "src/language-data/unirefund/TagService";

export default function TagActions({
  tagDetail,
  languageData,
}: {
  tagDetail: UniRefund_TagService_Tags_TagDetailDto;
  languageData: TagServiceResource;
}) {
  const travellerDocumentNo = tagDetail.traveller?.travelDocumentNumber || "";
  const router = useRouter();

  const status = tagDetail.status;
  if (status === "Paid") return null;

  return (
    <Card className="col-span-2 flex-1 rounded-none">
      <CardHeader className="flex-row justify-between py-4">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <PencilRuler />
          {languageData.TagActions}
        </CardTitle>
        <div className="flex flex-row gap-4">
          {status === "Open" && (
            <Button
              className="bg-green-700 text-white hover:bg-green-700/90 hover:text-white"
              variant="ghost"
            >
              {languageData.ExportValidation}
            </Button>
          )}
          {status === "Open" && (
            <Button
              onClick={() => {
                router.push(
                  `/operations/refund/need-validation?travellerDocumentNo=${travellerDocumentNo}`,
                );
              }}
              variant="default"
            >
              {languageData.EarlyRefund}
            </Button>
          )}
          {status === "Issued" && (
            <Button
              onClick={() => {
                router.push(
                  `/operations/refund/export-validated?travellerDocumentNo=${travellerDocumentNo}`,
                );
              }}
              variant="default"
            >
              {languageData.Refund}
            </Button>
          )}

          <Button disabled variant="secondary">
            {languageData.Cancel}
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
}
