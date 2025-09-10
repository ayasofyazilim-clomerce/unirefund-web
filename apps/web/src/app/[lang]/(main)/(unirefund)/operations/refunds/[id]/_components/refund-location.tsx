"use client";
import type {UniRefund_CRMService_RefundPoints_RefundPointDetailForRefund as RefundPointDetailForRefund} from "@repo/saas/CRMService";
import {Store} from "lucide-react";
import Link from "next/link";
import {useGrantedPolicies, isActionGranted} from "@repo/utils/policies";
import {getBaseLink} from "@/utils";
import {TextWithSubText} from "./text-with-subtext";
import {IconWithTitle} from "./icon-with-title";

export function RefundLocation({refundPointDetails}: {refundPointDetails: RefundPointDetailForRefund}) {
  const {grantedPolicies} = useGrantedPolicies();
  return (
    <div className="p-4">
      <IconWithTitle icon={Store} title="Refund location details" />
      <div className="mt-2 grid gap-6">
        <TextWithSubText
          subText={
            isActionGranted(["CRMService.RefundPoints.View"], grantedPolicies) ? (
              <Link
                className="font-semibold text-blue-500"
                href={getBaseLink(`parties/refund-points/${refundPointDetails.id}`)}>
                {refundPointDetails.name || "-"}
              </Link>
            ) : (
              <span className="font-semibold">{refundPointDetails.name}</span>
            )
          }
          text="Name"
        />
        <TextWithSubText
          subText={refundPointDetails.fullAddress ? refundPointDetails.fullAddress : "-"}
          text="Address"
        />
      </div>
    </div>
  );
}
