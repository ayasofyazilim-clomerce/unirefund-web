"use client";
import {Button} from "@/components/ui/button";
import type {UniRefund_TagService_Tags_TagDetailDto} from "@ayasofyazilim/saas/TagService";
import {isActionGranted, useGrantedPolicies} from "@repo/utils/policies";
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
  const {grantedPolicies} = useGrantedPolicies();
  const {tagId} = useParams<{tagId: string}>();
  const travellerDocumentNo = tagDetail.traveller?.travelDocumentNumber || "";

  const status = tagDetail.status;
  if (status !== "ExportValidated" && status !== "Issued" && status !== "EarlyPaid") return null;
  const hasGrant = {
    ExportValidation: isActionGranted(["TagService.Tags.ExportValidation"], grantedPolicies),
    Refund: isActionGranted(
      ["TagService.Tags", "RefundService.Refunds", "RefundService.Refunds.Create", "RefundService.Refunds.View"],
      grantedPolicies,
    ),
    EarlyRefund: isActionGranted(
      ["TagService.Tags", "RefundService.Refunds", "RefundService.Refunds.Create", "RefundService.Refunds.View"],
      grantedPolicies,
    ),
  };
  if (!hasGrant.ExportValidation && !hasGrant.Refund && !hasGrant.EarlyRefund) return null;
  return (
    <TagCard icon={<PencilRuler />} title={languageData.TagActions}>
      <div className="flex flex-col gap-4">
        {(status === "Issued" || status === "EarlyPaid") && hasGrant.ExportValidation ? (
          <Button
            onClick={() => {
              router.push(`/operations/export-validations/${tagId}/new`);
            }}
            variant="default">
            {languageData.ExportValidation}
          </Button>
        ) : null}
        {refundPoint && status === "Issued" && hasGrant.EarlyRefund ? (
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
        {refundPoint && status === "ExportValidated" && hasGrant.Refund ? (
          <Button
            onClick={() => {
              router.push(
                `/operations/refund/export-validated?travellerDocumentNumber=${travellerDocumentNo}&tagIds=${tagId}`,
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
