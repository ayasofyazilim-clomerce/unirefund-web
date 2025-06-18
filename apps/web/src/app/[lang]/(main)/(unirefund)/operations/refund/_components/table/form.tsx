"use client";

import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import type {
  UniRefund_TagService_Tags_Enums_RefundType as RefundTypeEnum,
  UniRefund_TagService_Tags_TagListItemDto,
} from "@ayasofyazilim/saas/TagService";
import {AlertCircle, Banknote, CreditCard} from "lucide-react";
import {useRouter} from "next/navigation";
import type {TransitionStartFunction} from "react";
import {useState, useTransition} from "react";
import {handlePostResponse} from "@repo/utils/api";
import {postRefundApi} from "@repo/actions/unirefund/RefundService/post-actions";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import type {
  UniRefund_RefundService_Refunds_CreateRefundIbanInfoDto as IbanInfoDto,
  UniRefund_RefundService_Refunds_CreateRefundCardInfoDto as CardInfoDto,
} from "@ayasofyazilim/saas/RefundService";
import {
  $UniRefund_RefundService_Refunds_CreateRefundCardInfoDto as $CardInfoDto,
  $UniRefund_RefundService_Refunds_CreateRefundIbanInfoDto as $IbanInfoDto,
} from "@ayasofyazilim/saas/RefundService";

export function RefundForm({
  refundPointId,
  selectedRows,
}: {
  selectedRows: Pick<UniRefund_TagService_Tags_TagListItemDto, "id" | "travellerDocumentNumber">[];
  refundPointId: string;
}) {
  const router = useRouter();
  const [refundMethod, setRefundMethod] = useState<RefundTypeEnum>("Cash");
  const [isPending, startTransition] = useTransition();

  const canRefundable =
    selectedRows.map((i) => i.travellerDocumentNumber).filter((i) => i !== selectedRows[0].travellerDocumentNumber)
      .length === 0;
  return (
    <>
      <div className="flex flex-col gap-2 rounded-lg bg-gray-100 p-2 text-center">
        {selectedRows.length} transaction selected
      </div>
      {!canRefundable && (
        <Alert className="my-3" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            You can not have transactions from different travellers in the same refund.
          </AlertDescription>
        </Alert>
      )}
      <div className="my-3 flex flex-col space-y-1.5 text-center">
        <div className="font-semibold leading-none">Payment Method</div>
        <div className="text-muted-foreground text-sm">Select a payment method.</div>
      </div>
      <div className="my-3 grid gap-6">
        <RadioGroup
          className="grid grid-cols-3 gap-4"
          defaultValue={refundMethod}
          onValueChange={(value) => {
            setRefundMethod(value as RefundTypeEnum);
          }}>
          <div>
            <RadioGroupItem aria-label="Card" className="peer sr-only" id="card" value="CreditCard" />
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
          <div>
            <RadioGroupItem
              aria-label="Bank Transfer"
              className="peer sr-only"
              id="bank-transfer"
              value="BankTransfer"
            />
            <Label
              className="border-muted hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary flex flex-col items-center justify-between rounded-md border-2 bg-transparent p-4"
              htmlFor="bank-transfer">
              <Banknote className="mb-3 h-6 w-6" />
              Bank Transfer
            </Label>
          </div>
        </RadioGroup>
      </div>
      <div>
        <RefundMethodForm
          canRefundable={canRefundable}
          isPending={isPending}
          refundMethod={refundMethod}
          refundPointId={refundPointId}
          router={router}
          selectedRows={selectedRows}
          startTransition={startTransition}
        />
      </div>
    </>
  );
}
export function RefundMethodForm({
  refundMethod,
  refundPointId,
  selectedRows,
  router,
  isPending,
  canRefundable,
  startTransition,
}: {
  refundMethod: RefundTypeEnum;
  selectedRows: Pick<UniRefund_TagService_Tags_TagListItemDto, "id">[];
  refundPointId: string;
  router: ReturnType<typeof useRouter>;
  isPending: boolean;
  canRefundable: boolean;
  startTransition: TransitionStartFunction;
}) {
  function handleSubmit(formData: IbanInfoDto | CardInfoDto | null) {
    startTransition(() => {
      void postRefundApi({
        requestBody: {
          ...form,
          ibanInfo: refundMethod === "BankTransfer" ? (formData as IbanInfoDto) : undefined,
          cardInfo: refundMethod === "CreditCard" ? (formData as CardInfoDto) : undefined,
        },
      }).then((response) => {
        handlePostResponse(response, router);
      });
    });
  }
  const form = {
    refundTypeEnum: refundMethod,
    refundPointId,
    tagIds: selectedRows.map((tag) => tag.id || ""),
  };
  switch (refundMethod) {
    case "BankTransfer":
      return (
        <SchemaForm<IbanInfoDto>
          onSubmit={({formData}) => {
            if (formData) handleSubmit(formData);
          }}
          schema={$IbanInfoDto}
          useDefaultSubmit={false}>
          <div className="mt-4 flex items-center">
            <Button className="w-full" disabled={!canRefundable || isPending || selectedRows.length === 0}>
              Continue
            </Button>
          </div>
        </SchemaForm>
      );
    case "CreditCard":
      return (
        <SchemaForm<CardInfoDto>
          onSubmit={({formData}) => {
            if (formData) handleSubmit(formData);
          }}
          schema={$CardInfoDto}
          useDefaultSubmit={false}>
          <div className="mt-4 flex items-center">
            <Button className="w-full" disabled={!canRefundable || isPending || selectedRows.length === 0}>
              Continue
            </Button>
          </div>
        </SchemaForm>
      );
    default:
      return (
        <Button
          className="w-full"
          disabled={!canRefundable || isPending || selectedRows.length === 0}
          onClick={() => {
            handleSubmit(null);
          }}>
          Continue
        </Button>
      );
  }
}
