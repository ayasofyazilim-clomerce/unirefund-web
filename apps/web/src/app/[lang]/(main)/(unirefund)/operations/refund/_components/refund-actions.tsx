import {Button} from "@/components/ui/button";
import {postRefundApi} from "@repo/actions/unirefund/RefundService/post-actions";
import type {
  UniRefund_ContractService_Enums_RefundMethod,
  UniRefund_TagService_Tags_TagListItemDto,
} from "@repo/saas/TagService";
import {ChevronRightIcon} from "lucide-react";
import {useRouter, useSearchParams} from "next/navigation";
import cardValidator from "card-validator";
import {handlePostResponse} from "@repo/utils/api";
import type {TagServiceResource} from "@/language-data/unirefund/TagService";
import {useRefund} from "../client-page";

function RefundActions({
  selectedRows,
  getTotals,
  refundPointId,
  languageData,
  paymentTypesResponse,
}: {
  selectedRows: UniRefund_TagService_Tags_TagListItemDto[];
  getTotals: (
    totalType: keyof UniRefund_TagService_Tags_TagListItemDto,
    selectedRows: UniRefund_TagService_Tags_TagListItemDto[],
  ) => string;
  languageData: TagServiceResource;
  paymentTypesResponse?: UniRefund_ContractService_Enums_RefundMethod[];
  refundPointId?: string;
}) {
  const router = useRouter();
  const {formData, isPending, startTransition} = useRefund();
  const searchParams = useSearchParams();
  const refundMethod = searchParams.get("refundMethod");

  const isSubmitDisabled = selectedRows.length === 0 || !refundPointId || isPending || errorOnCreditCardValidation();

  function errorOnCreditCardValidation() {
    if (refundMethod !== "CreditCard") {
      return false;
    }
    const numberValidation = cardValidator.number(formData.cardInfo?.cardNumber || "");
    const expiryDate = `${formData.cardInfo?.cardExpiryMonth}${formData.cardInfo?.cardExpiryYear}`;
    const expiryDateValidation = cardValidator.expirationDate(expiryDate);
    if (!numberValidation.isValid || !expiryDateValidation.isValid) {
      return true;
    }
    return false;
  }
  function handlePostRefund() {
    const refundTypeEnum = paymentTypesResponse?.find((type) => type === refundMethod);
    if (!refundTypeEnum || !refundPointId) {
      return;
    }
    startTransition(() => {
      void postRefundApi({
        ...formData,
        refundPointId,
        tagIds: selectedRows.map((i) => i.id),
        refundTypeEnum,
        cardInfo: {
          cardNumber: formData.cardInfo?.cardNumber || "",
          cardExpiryMonth: Number(formData.cardInfo?.cardExpiryMonth),
          cardExpiryYear: Number(formData.cardInfo?.cardExpiryYear),
        },
      }).then((response) => {
        handlePostResponse(
          response,
          router,
          response.type === "success" ? `/operations/refunds/${response.data.id}/tags` : undefined,
        );
      });
    });
  }

  return (
    <div className="grid grid-cols-4 items-center gap-1 overflow-hidden rounded-md bg-white py-2 text-center text-white">
      <div className="bg-muted text-muted-foreground flex h-full flex-col justify-center rounded-l-md py-2 text-sm font-medium">
        <div>{languageData.TransactionSelected}</div>
        <div className="text-black">{selectedRows.length}</div>
      </div>
      <div className="bg-muted text-muted-foreground flex h-full flex-col justify-center py-2 text-sm font-medium">
        <div>{languageData.SalesAmount} </div>
        <div className="text-black">{getTotals("salesAmount", selectedRows)}</div>
      </div>
      <div className="bg-muted text-muted-foreground flex h-full flex-col justify-center py-2 text-sm font-medium">
        <div>{languageData.GrossRefund} </div>
        <div className="text-black">{getTotals("grossRefund", selectedRows)}</div>
      </div>

      <Button
        className="relative flex h-full flex-col rounded-l-none bg-emerald-600 py-2 text-sm font-medium hover:bg-emerald-700 hover:text-white"
        data-testid="button-refund"
        disabled={isSubmitDisabled}
        onClick={handlePostRefund}
        variant="ghost">
        <div>{languageData.Refund} </div>
        <div>{getTotals("refund", selectedRows)}</div>
        <div className="absolute bottom-0 right-0 top-0 flex items-center md:right-2">
          <ChevronRightIcon />
        </div>
      </Button>
    </div>
  );
}

export default RefundActions;
