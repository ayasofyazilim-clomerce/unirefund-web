"use client";
import {Button} from "@/components/ui/button";
import type {UniRefund_TagService_Tags_TagDetailDto} from "@ayasofyazilim/saas/TagService";
import {PencilRuler} from "lucide-react";
import {useParams, useRouter} from "next/navigation";
import type {TagServiceResource} from "src/language-data/unirefund/TagService";
import {TagCard} from "./tag-card";

export default function TagActions({
  tagDetail,
  languageData,
  refundPoint,
}: {
  tagDetail: UniRefund_TagService_Tags_TagDetailDto;
  languageData: TagServiceResource;
  refundPoint: boolean;
}) {
  const router = useRouter();
  const {tagId} = useParams<{tagId: string}>();
  const travellerDocumentNo = tagDetail.traveller?.travelDocumentNumber || "";

  const status = tagDetail.status;
  if (status !== "ExportValidated" && status !== "Issued" && status !== "EarlyPaid") return null;

  return (
    <TagCard icon={<PencilRuler />} title={languageData.TagActions}>
      <div className="flex flex-col gap-4">
        {(status === "Issued" || status === "EarlyPaid") && (
          <Button
            onClick={() => {
              router.push(`/operations/export-validations/${tagId}/new`);
            }}
            variant="default">
            {languageData.ExportValidation}
          </Button>
        )}
        {refundPoint && status === "Issued" ? (
          <Button
            onClick={() => {
              router.push(
                `/operations/refund/need-validation?travellerDocumentNumber=${travellerDocumentNo}&tagIds=${tagDetail.id}`,
              );
            }}
            variant="default">
            {languageData.EarlyRefund}
          </Button>
        ) : null}
        {refundPoint && status === "ExportValidated" ? (
          <Button
            onClick={() => {
              router.push(
                `/operations/refund/export-validated?travellerDocumentNumber=${travellerDocumentNo}&tagIds=${tagDetail.id}`,
              );
            }}
            variant="default">
            {languageData.Refund}
          </Button>
        ) : null}
      </div>
    </TagCard>
  );
}
