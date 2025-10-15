import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import type {
  UniRefund_ContractService_Enums_RefundMethod,
  UniRefund_TagService_Tags_TagListItemDto,
} from "@repo/saas/TagService";
import {ChevronRightIcon} from "lucide-react";
import {useSession} from "next-auth/react";
import {useSearchParams} from "next/navigation";
import type {TagServiceResource} from "@/language-data/unirefund/TagService";
import {RefundMethodForm} from "./form";

function RefundActions({
  selectedRows,
  getTotals,
  isPending,
  languageData,
  startTransition,
}: {
  selectedRows: UniRefund_TagService_Tags_TagListItemDto[];
  getTotals: (
    totalType: keyof UniRefund_TagService_Tags_TagListItemDto,
    selectedRows: UniRefund_TagService_Tags_TagListItemDto[],
  ) => string;
  isPending: boolean;
  languageData: TagServiceResource;
  startTransition: (arg0: () => void) => void;
}) {
  const searchParams = useSearchParams();
  const user = useSession().data?.user;
  const refundPointId =
    (user?.RefundPointId && (Array.isArray(user.RefundPointId) ? user.RefundPointId[0] : user.RefundPointId)) || "";
  const refundMethod = searchParams.get("refundMethod") as UniRefund_ContractService_Enums_RefundMethod;

  return (
    <div className="grid grid-cols-4 items-center gap-1 overflow-hidden rounded-md bg-white py-2 text-center text-white">
      <div className="bg-muted text-muted-foreground rounded-l-md py-2 text-sm font-medium">
        <div>{languageData.TransactionSelected}</div>
        <div className="text-black">{selectedRows.length}</div>
      </div>
      <div className="bg-muted text-muted-foreground py-2 text-sm font-medium ">
        <div>{languageData.SalesAmount} </div>
        <div className="text-black">{getTotals("salesAmount", selectedRows)}</div>
      </div>
      <div className="bg-muted text-muted-foreground py-2 text-sm font-medium ">
        <div>{languageData.GrossRefund} </div>
        <div className="text-black">{getTotals("grossRefund", selectedRows)}</div>
      </div>

      <Dialog>
        <DialogTrigger asChild data-testid="trigger-refund">
          <Button
            className="relative flex h-full flex-col rounded-l-none bg-emerald-600 py-2 text-sm font-medium hover:bg-emerald-700 hover:text-white"
            data-testid="button-refund"
            disabled={selectedRows.length === 0 || isPending}
            variant="ghost">
            <div>{languageData.Refund} </div>
            <div>{getTotals("refund", selectedRows)}</div>
            <div className="absolute bottom-0 right-2 top-0 flex items-center">
              <ChevronRightIcon />
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle>{languageData.Refund}</DialogTitle>
          <RefundMethodForm
            isPending={isPending}
            languageData={languageData}
            refundMethod={refundMethod}
            refundPointId={refundPointId}
            selectedRows={selectedRows}
            startTransition={startTransition}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default RefundActions;
