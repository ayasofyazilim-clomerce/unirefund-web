"use client";
import {Separator} from "@/components/ui/separator";
import type {UniRefund_RefundService_Refunds_GetDetailAsync_RefundDetailDto as RefundDetailDto} from "@repo/saas/RefundService";
import {CheckCircle2} from "lucide-react";
import {useParams} from "next/navigation";
import {IconWithTitle} from "./icon-with-title";
import {TextWithSubText} from "./text-with-subtext";

export function RefundSummary({refundDetails}: {refundDetails: RefundDetailDto}) {
  const {lang} = useParams<{lang: string}>();
  return (
    <>
      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <IconWithTitle icon={CheckCircle2} title="Refund Summary" />
          {/* <Button variant="outline">
            <Printer className="mr-2 w-4" />
            Factura
          </Button> */}
        </div>
        <div className="mt-2 flex gap-6">
          <TextWithSubText
            orientation="vertical"
            subText={`${refundDetails.refundAmount} ${refundDetails.refundCurrency}`}
            text="Amount"
          />
          <TextWithSubText orientation="vertical" subText={refundDetails.status} text="Status" />
          <TextWithSubText orientation="vertical" subText={refundDetails.refundTypeEnum} text="Refund method" />
          <TextWithSubText
            className="ml-auto"
            orientation="vertical"
            subText={refundDetails.referenceNumber}
            text="Reference number"
          />
        </div>
      </div>
      <Separator />
      <div className="flex justify-between p-4">
        <div className="grid gap-2">
          <h4 className="mt-2 text-2xl font-bold">Details</h4>
          <TextWithSubText subText={new Date(refundDetails.processedDate).toLocaleDateString(lang)} text="Created" />
          <TextWithSubText
            subText={refundDetails.paidDate ? new Date(refundDetails.paidDate).toLocaleDateString(lang) : "-"}
            text="Paid"
          />
        </div>
        <div className="grid gap-2">
          <h4 className="mt-2 text-2xl font-bold">Reconciliation</h4>
          <TextWithSubText subText={refundDetails.reconciliationStatus} text="Status" />
        </div>
      </div>
    </>
  );
}
