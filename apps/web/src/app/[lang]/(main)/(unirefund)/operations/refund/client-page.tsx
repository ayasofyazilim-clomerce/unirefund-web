"use client";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import type {UniRefund_CRMService_RefundPoints_RefundPointListResponseDto} from "@repo/saas/CRMService";
import type {
  PagedResultDto_TagListItemDto,
  UniRefund_ContractService_Enums_RefundMethod,
  UniRefund_TagService_Tags_TagListItemDto,
} from "@repo/saas/TagService";
import {formatCurrency} from "@repo/ui/utils";
import {Terminal} from "lucide-react";
import type {UniRefund_TravellerService_Travellers_TravellerListDto} from "node_modules/@ayasofyazilim/unirefund-saas-dev/TravellerService/types.gen";
import {useState, useTransition} from "react";
import {useTenant} from "@/providers/tenant";
import type {TagServiceResource} from "@/language-data/unirefund/TagService";
import LoadingSpinner from "@/components/loading/loading-spinner";
import RefundActions from "./_components/refund-actions";
import RefundFilters from "./_components/refund-filters";
import ExportValidatedTable from "./_components/table";

export function ClientPage({
  travellerResponse,
  paymentTypesResponse,
  tagResponse,
  accessibleRefundPoints,
  languageData,
}: {
  languageData: TagServiceResource;
  travellerResponse?: UniRefund_TravellerService_Travellers_TravellerListDto;
  paymentTypesResponse?: UniRefund_ContractService_Enums_RefundMethod[];
  tagResponse?: PagedResultDto_TagListItemDto;
  accessibleRefundPoints: UniRefund_CRMService_RefundPoints_RefundPointListResponseDto[];
}) {
  const {localization, currency} = useTenant();
  const [isPending, startTransition] = useTransition();
  const [selectedRows, setSelectedRows] = useState<UniRefund_TagService_Tags_TagListItemDto[]>([]);

  function getTotals(
    totalType: keyof UniRefund_TagService_Tags_TagListItemDto,
    rows: UniRefund_TagService_Tags_TagListItemDto[],
  ) {
    const total = rows.reduce((acc, row) => acc + ((row[totalType] as number) || 0), 0);

    if (!total) return formatCurrency(localization.locale, currency || "USD", 0);

    return formatCurrency(localization.locale, rows[0]?.currency || "USD", total);
  }

  if (isPending) {
    return (
      <div className="flex h-full items-center justify-center md:col-span-6">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="mt-2 flex flex-col space-y-2 overflow-hidden">
      <RefundFilters
        accessibleRefundPoints={accessibleRefundPoints}
        isPending={isPending}
        languageData={languageData}
        paymentTypesResponse={paymentTypesResponse}
        startTransition={startTransition}
        travellerResponse={travellerResponse}
      />
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
            isPending={isPending}
            languageData={languageData}
            selectedRows={selectedRows}
            startTransition={startTransition}
          />
        </div>
      ) : (
        <div className="col-span-6">
          <Alert variant="default">
            <Terminal />
            <AlertTitle>Info</AlertTitle>
            <AlertDescription>{languageData.SearchTravellerToSeeTags}</AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}
