"use client";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import type {UniRefund_CRMService_RefundPoints_RefundPointListResponseDto} from "@repo/saas/CRMService";
import type {UniRefund_RefundService_Refunds_CreateRefundDto} from "@repo/saas/RefundService";
import type {
  PagedResultDto_TagListItemDto,
  UniRefund_ContractService_Enums_RefundMethod,
  UniRefund_TagService_Tags_TagListItemDto,
} from "@repo/saas/TagService";
import {formatCurrency} from "@repo/ui/utils";
import {Terminal} from "lucide-react";
import type {UniRefund_TravellerService_Travellers_TravellerListDto} from "@repo/saas/TravellerService";
import {createContext, useContext, useState, useTransition} from "react";
import {useSearchParams} from "next/navigation";
import {useTenant} from "@/providers/tenant";
import type {TagServiceResource} from "@/language-data/unirefund/TagService";
import LoadingSpinner from "@/components/loading/loading-spinner";
import RefundActions from "./_components/refund-actions";
import RefundFilters from "./_components/refund-filters";
import ExportValidatedTable from "./_components/table";

type RefundFormData = Omit<
  UniRefund_RefundService_Refunds_CreateRefundDto,
  "cardInfo" | "paidDate" | "refundTypeEnum" | "refundPointId" | "tagIds"
> & {
  cardInfo?: {
    cardNumber: string;
    cardExpiryMonth: string;
    cardExpiryYear: string;
  };
  paidDate: string;
};

type RefundContextType = {
  isPending: boolean;
  startTransition: (arg0: () => void) => void;
  formData: RefundFormData;
  setFormData: React.Dispatch<React.SetStateAction<RefundFormData>>;
};

export const RefundContext = createContext<RefundContextType>({
  formData: {
    paidDate: new Date().toISOString(),
    cardInfo: {
      cardNumber: "",
      cardExpiryMonth: "",
      cardExpiryYear: "",
    },
    ibanInfo: {
      iban: "",
      bankName: "",
      bic: "",
    },
  },
  setFormData: () => {
    /**/
  },
  isPending: false,
  startTransition: () => {
    /**/
  },
});

export const useRefund = () => {
  return useContext(RefundContext);
};

export function ClientPage({
  travellerResponse,
  paymentTypesResponse,
  tagResponse,
  accessibleRefundPoints,
  languageData,
  refundPointId,
}: {
  refundPointId?: string;
  languageData: TagServiceResource;
  travellerResponse?: UniRefund_TravellerService_Travellers_TravellerListDto;
  paymentTypesResponse?: UniRefund_ContractService_Enums_RefundMethod[];
  tagResponse?: PagedResultDto_TagListItemDto;
  accessibleRefundPoints: UniRefund_CRMService_RefundPoints_RefundPointListResponseDto[];
}) {
  const searchParams = useSearchParams();
  const {localization, currency} = useTenant();
  const [isPending, startTransition] = useTransition();
  const [selectedRows, setSelectedRows] = useState<UniRefund_TagService_Tags_TagListItemDto[]>([]);

  // If it is refund point user, refundPointId is correct, if it is admin user, refundPointId might be undefined

  const [formData, setFormData] = useState<RefundFormData>({
    paidDate: new Date().toISOString(),
  });

  function getTotals(
    totalType: keyof UniRefund_TagService_Tags_TagListItemDto,
    rows: UniRefund_TagService_Tags_TagListItemDto[],
  ) {
    const total = rows.reduce((acc, row) => acc + ((row[totalType] as number) || 0), 0);

    if (!total) return formatCurrency(localization.locale, currency || "USD", 0);

    return formatCurrency(localization.locale, rows[0]?.currency || "USD", total);
  }

  function missingStepErrors() {
    if (!refundPointId) return languageData.SelectARefundPoint;
    if (!travellerResponse) return languageData.SearchTravellerToSeeTags;
    if (!searchParams.get("status")) return languageData.SelectATagStatus;
    if (paymentTypesResponse?.length === 0) return languageData.NoPaymentMethodExistsForSelectedRefundPoint;
    return false;
  }
  const isMissingStepError = missingStepErrors();

  if (isPending) {
    return (
      <div className="flex h-full items-center justify-center md:col-span-6">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <RefundContext.Provider value={{formData, setFormData, isPending, startTransition}}>
      <div className="mt-2 flex flex-col space-y-2 md:overflow-hidden">
        <RefundFilters
          accessibleRefundPoints={accessibleRefundPoints}
          languageData={languageData}
          paymentTypesResponse={paymentTypesResponse}
          travellerResponse={travellerResponse}
        />
        {isMissingStepError ? (
          <div className="col-span-6">
            <Alert variant="default">
              <Terminal />
              <AlertTitle>Info</AlertTitle>
              <AlertDescription>{isMissingStepError}</AlertDescription>
            </Alert>
          </div>
        ) : null}
        {tagResponse ? (
          <div className="flex flex-col overflow-hidden md:col-span-6">
            <div className="mb-2 grid grid-cols-4 items-center rounded-md border py-2 text-center">
              <div className="flex h-full items-center justify-center border-r text-sm font-medium">
                <div>{languageData.Totals}</div>
              </div>
              <div className="border-r text-sm font-medium">
                <div className="text-muted-foreground">{languageData.SalesAmount} </div>
                <div>{getTotals("salesAmount", tagResponse.items || [])}</div>
              </div>
              <div className="border-r text-sm font-medium">
                <div className="text-muted-foreground">{languageData.GrossRefund} </div>
                <div>{getTotals("grossRefund", tagResponse.items || [])}</div>
              </div>
              <div className="text-sm font-medium">
                <div className="text-muted-foreground">{languageData.Refund} </div>
                <div>{getTotals("refund", tagResponse.items || [])}</div>
              </div>
            </div>
            <div className="h-0 flex-1">
              <ExportValidatedTable
                languageData={languageData}
                localization={localization}
                response={tagResponse}
                setSelectedRows={setSelectedRows}
              />
            </div>
            <RefundActions
              getTotals={getTotals}
              languageData={languageData}
              paymentTypesResponse={paymentTypesResponse || []}
              refundPointId={refundPointId}
              selectedRows={selectedRows}
            />
          </div>
        ) : null}
      </div>
    </RefundContext.Provider>
  );
}
