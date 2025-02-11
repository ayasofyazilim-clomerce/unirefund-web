import type {UniRefund_CRMService_RefundPoints_RefundPointDetailForRefund as RefundPointDetailForRefund} from "@ayasofyazilim/saas/CRMService";
import {Store} from "lucide-react";
import Link from "next/link";
import {IconWithTitle} from "./icon-with-title";
import {TextWithSubText} from "./text-with-subtext";
// import {getBaseLink} from "@/utils";

export function RefundLocation({refundPointDetails}: {refundPointDetails: RefundPointDetailForRefund}) {
  return (
    <div className="p-4">
      <IconWithTitle icon={Store} title="Refund location details" />
      <div className="mt-2 grid gap-6">
        <TextWithSubText
          subText={
            // getBaseLink(`parties/refund-points/${refundPointDetails.id}`)
            <Link className="font-semibold text-blue-500" href="">
              {refundPointDetails.name || "-"}
            </Link>
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
