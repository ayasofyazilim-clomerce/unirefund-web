"use client";

import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import type {
  UniRefund_TagService_Tags_Enums_RefundType,
  UniRefund_TagService_Tags_TagListItemDto,
} from "@ayasofyazilim/saas/TagService";
import {AlertCircle, Banknote, CreditCard} from "lucide-react";
import {useRouter} from "next/navigation";
import {useState, useTransition} from "react";
import {handlePostResponse} from "@repo/utils/api";
import {postRefundApi} from "@repo/actions/unirefund/RefundService/post-actions";

export function RefundForm({
  refundPointId,
  selectedRows,
}: {
  selectedRows: Pick<UniRefund_TagService_Tags_TagListItemDto, "id" | "travellerDocumentNumber">[];
  refundPointId: string;
}) {
  const router = useRouter();
  const [refundMethod, setRefundMethod] = useState<string>("Cash");
  const [isPending, startTransition] = useTransition();

  const canRefundable =
    selectedRows.map((i) => i.travellerDocumentNumber).filter((i) => i !== selectedRows[0].travellerDocumentNumber)
      .length === 0;
  function onSubmit() {
    startTransition(() => {
      void postRefundApi({
        requestBody: {
          refundType: refundMethod as UniRefund_TagService_Tags_Enums_RefundType,
          refundPointId,
          tagIds: selectedRows.map((tag) => tag.id || ""),
        },
      }).then((response) => {
        handlePostResponse(response, router);
      });
    });
  }
  return (
    <>
      <div className="flex flex-col gap-2 rounded-lg bg-gray-100 p-6">{selectedRows.length} transaction selected</div>
      {!canRefundable && (
        <Alert className="my-3" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            You can not have transactions from different travellers in the same refund.
          </AlertDescription>
        </Alert>
      )}
      <div className="my-3 flex flex-col space-y-1.5">
        <div className="font-semibold leading-none">Payment Method</div>
        <div className="text-muted-foreground text-sm">Select a payment method.</div>
      </div>
      <div className="my-3 grid gap-6">
        <RadioGroup className="grid grid-cols-2 gap-4" defaultValue={refundMethod} onValueChange={setRefundMethod}>
          <div>
            <RadioGroupItem aria-label="Card" className="peer sr-only" disabled id="card" value="CreditCard" />
            <Label
              className="border-muted hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary flex flex-col items-center justify-between rounded-md border-2 bg-transparent p-4"
              htmlFor="card">
              <CreditCard className="mb-3 h-6 w-6" />
              Card
            </Label>
          </div>
          <div>
            <RadioGroupItem aria-label="Cash" className="peer sr-only" id="cash" value="Cash" />
            <Label
              className="border-muted hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary flex flex-col items-center justify-between rounded-md border-2 bg-transparent p-4"
              htmlFor="cash">
              <Banknote className="mb-3 h-6 w-6" />
              Cash
            </Label>
          </div>
        </RadioGroup>
      </div>
      <div className="flex items-center">
        <Button
          className="w-full"
          disabled={!canRefundable || refundMethod !== "Cash" || isPending || selectedRows.length === 0}
          onClick={onSubmit}>
          Continue
        </Button>
      </div>
    </>
  );
}
