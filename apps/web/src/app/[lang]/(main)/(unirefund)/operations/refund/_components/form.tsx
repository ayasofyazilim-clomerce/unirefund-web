"use client";

import {Button} from "@/components/ui/button";
import {postRefundApi} from "@repo/actions/unirefund/RefundService/post-actions";
import {DatePicker} from "@repo/ayasofyazilim-ui/molecules/date-picker";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import type {
  UniRefund_RefundService_Refunds_CreateRefundCardInfoDto as CardInfoDto,
  UniRefund_RefundService_Refunds_CreateRefundIbanInfoDto as IbanInfoDto,
} from "@repo/saas/RefundService";
import {
  $UniRefund_RefundService_Refunds_CreateRefundCardInfoDto as $CardInfoDto,
  $UniRefund_RefundService_Refunds_CreateRefundIbanInfoDto as $IbanInfoDto,
} from "@repo/saas/RefundService";
import type {
  UniRefund_ContractService_Enums_RefundMethod as RefundTypeEnum,
  UniRefund_TagService_Tags_TagListItemDto,
} from "@repo/saas/TagService";
import {handlePostResponse} from "@repo/utils/api";
import {useRouter} from "next/navigation";
import type {TransitionStartFunction} from "react";
import {useState} from "react";
import type {TagServiceResource} from "@/language-data/unirefund/TagService";

export function RefundMethodForm({
  refundMethod,
  refundPointId,
  selectedRows,
  isPending,
  startTransition,
  languageData,
}: {
  refundMethod?: string;
  selectedRows: Pick<UniRefund_TagService_Tags_TagListItemDto, "id">[];
  refundPointId: string;
  isPending: boolean;
  startTransition: TransitionStartFunction;
  languageData: TagServiceResource;
}) {
  const router = useRouter();
  const [date, setDate] = useState<Date | null>(null);

  function handleSubmit(formData?: IbanInfoDto | CardInfoDto) {
    const refundMethods: RefundTypeEnum[] = ["Cash", "CreditCard", "BankTransfer", "Wallet", "CashViaPartner"];
    const refundTypeEnum = refundMethods.find((type) => type === refundMethod);
    if (!refundTypeEnum) {
      return;
    }
    const form = {
      refundTypeEnum,
      refundPointId,
      tagIds: selectedRows.map((tag) => tag.id || ""),
    };

    startTransition(() => {
      void postRefundApi({
        ...form,
        ibanInfo: refundTypeEnum === "BankTransfer" ? (formData as IbanInfoDto) : undefined,
        cardInfo: refundTypeEnum === "CreditCard" ? (formData as CardInfoDto) : undefined,
        paidDate: refundTypeEnum === "Cash" ? date?.toISOString() : undefined,
      }).then((response) => {
        handlePostResponse(
          response,
          router,
          response.type === "success" ? `/operations/refunds/${response.data.id}/tags` : undefined,
        );
      });
    });
  }

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
            <Button
              className="w-full"
              data-testid="bank_transfer_continue"
              disabled={isPending || selectedRows.length === 0}>
              {languageData.Continue}
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
            <Button
              className="w-full"
              data-testid="credit_card_continue"
              disabled={isPending || selectedRows.length === 0}>
              {languageData.Continue}
            </Button>
          </div>
        </SchemaForm>
      );
    default:
      return (
        <>
          <DatePicker
            defaultValue={new Date()}
            id="cash-refund-date"
            label={languageData.PaidDate}
            onChange={setDate}
            useTime
          />
          <Button
            className="w-full"
            data-testid="cash-continue"
            disabled={isPending || selectedRows.length === 0}
            onClick={() => {
              handleSubmit();
            }}>
            {languageData.Continue}
          </Button>
        </>
      );
  }
}
