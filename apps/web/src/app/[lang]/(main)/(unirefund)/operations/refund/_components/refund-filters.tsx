"use client";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {PersonIcon} from "@radix-ui/react-icons";
import {Combobox} from "@repo/ayasofyazilim-ui/molecules/combobox";
import SelectTabs, {SelectTabsContent} from "@repo/ayasofyazilim-ui/molecules/select-tabs";
import type {UniRefund_CRMService_RefundPoints_RefundPointListResponseDto} from "@repo/saas/CRMService";
import type {UniRefund_ContractService_Enums_RefundMethod} from "@repo/saas/TagService";
import {SquarePen, Terminal} from "lucide-react";
import {useRouter, useSearchParams} from "next/navigation";
import type {UniRefund_TravellerService_Travellers_TravellerListDto} from "node_modules/@ayasofyazilim/unirefund-saas-dev/TravellerService/types.gen";
import {useEffect, useState} from "react";
import type {TagServiceResource} from "@/language-data/unirefund/TagService";
import {useRefund} from "../client-page";
import PaymentForm from "./payment-form";

function RefundFilters({
  travellerResponse,
  paymentTypesResponse,

  languageData,
  accessibleRefundPoints,
}: {
  languageData: TagServiceResource;
  travellerResponse?: UniRefund_TravellerService_Travellers_TravellerListDto;
  paymentTypesResponse?: UniRefund_ContractService_Enums_RefundMethod[];
  accessibleRefundPoints: UniRefund_CRMService_RefundPoints_RefundPointListResponseDto[];
}) {
  const {isPending, startTransition} = useRefund();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTravellerDocumentNumberVisible, setSearchTravellerDocumentNumberVisible] =
    useState<boolean>(!travellerResponse);

  const [selectedRefundMethod, setSelectedRefundMethod] = useState<string | undefined>(
    paymentTypesResponse?.length === 1 ? paymentTypesResponse[0] : searchParams.get("refundMethod") || undefined,
  );

  const [status, setStatus] = useState<string | undefined>(searchParams.get("status") || undefined);
  const [travellerDocumentNumber, setTravellerDocumentNumber] = useState<string>(
    searchParams.get("travellerDocumentNumber") || "",
  );
  const [selectedRefundPoint, setSelectedRefundPoint] = useState<
    UniRefund_CRMService_RefundPoints_RefundPointListResponseDto | null | undefined
  >(accessibleRefundPoints.find((i) => i.id === searchParams.get("refundPointId")) || null);

  useEffect(() => {
    setSearchTravellerDocumentNumberVisible(!travellerResponse);
  }, [travellerResponse]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    const isValidRefundMethod = Boolean(paymentTypesResponse?.find((type) => type === selectedRefundMethod));
    if (!isValidRefundMethod) {
      params.delete("refundMethod");
    } else if (selectedRefundMethod !== searchParams.get("refundMethod")) {
      params.set("refundMethod", selectedRefundMethod || "");
    }

    const isValidStatus = ["export-validated", "need-validation"].includes(status || "");
    if (!isValidStatus) {
      params.delete("status");
    } else if (status !== searchParams.get("status")) {
      params.set("status", status || "export-validated");
    }
    if (selectedRefundPoint?.id) {
      params.set("refundPointId", selectedRefundPoint.id);
    } else {
      params.delete("refundPointId");
    }

    if (params.toString() === searchParams.toString()) return;
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  }, [selectedRefundMethod, status, searchParams, selectedRefundPoint]);

  function handleSearchTraveller() {
    if (!travellerDocumentNumber) return;
    const params = new URLSearchParams(searchParams.toString());
    if (travellerDocumentNumber === params.get("travellerDocumentNumber") && travellerResponse) {
      setSearchTravellerDocumentNumberVisible(false);
      return;
    }
    params.set("travellerDocumentNumber", travellerDocumentNumber);
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  }
  return (
    <div className="flex flex-row flex-wrap gap-2">
      {accessibleRefundPoints.length > 0 && (
        <Card className="flex-1 px-6 py-4">
          <div className="mb-4 text-lg font-semibold">{languageData.RefundPoint}</div>
          <div className="grid grid-cols-1 gap-2">
            <Combobox<UniRefund_CRMService_RefundPoints_RefundPointListResponseDto>
              id="refund-point-list"
              list={accessibleRefundPoints}
              onValueChange={setSelectedRefundPoint}
              selectIdentifier="id"
              selectLabel="name"
              value={selectedRefundPoint}
            />
          </div>
        </Card>
      )}
      <Card className="min-w-60 flex-1 p-4 py-4">
        <div className="mb-4 text-lg font-semibold">{languageData.TravellerDocumentNo}</div>
        <div className="grid grid-cols-1 gap-2">
          {searchTravellerDocumentNumberVisible ? (
            <div className="grid w-full items-center gap-2">
              <Input
                data-testid="input-traveller-document-no"
                id="email"
                onChange={(e) => {
                  setTravellerDocumentNumber(e.target.value);
                }}
                placeholder={languageData.TravellerDocumentNo}
                type="text"
                value={travellerDocumentNumber}
              />
              <Button
                className="w-full"
                data-testid="button-search-traveller"
                disabled={!travellerDocumentNumber || isPending}
                onClick={handleSearchTraveller}>
                {languageData.Search}
              </Button>
              {searchParams.get("travellerDocumentNumber") && !travellerResponse && (
                <Alert variant="destructive">
                  <Terminal />
                  <AlertTitle>{languageData.error}!</AlertTitle>
                  <AlertDescription>{languageData.NoTravellerFound}</AlertDescription>
                </Alert>
              )}
            </div>
          ) : (
            <div className="flex flex-row gap-4">
              <PersonIcon className="size-8" />
              <div className="grid w-full items-center">
                <div>{travellerResponse?.fullName}</div>
                <div className="text-sm">{travellerResponse?.nationalityCountryName}</div>
                <div className="text-sm">{travellerDocumentNumber}</div>
              </div>
              <Button
                data-testid="button-toggle-search-traveller"
                disabled={isPending}
                onClick={() => {
                  setSearchTravellerDocumentNumberVisible(true);
                }}
                size="icon"
                variant="ghost">
                <SquarePen className="size-6" />
              </Button>
            </div>
          )}
        </div>
        <div className="mb-2 mt-4 font-semibold">{languageData.Status}</div>
        <SelectTabs className="flex flex-row flex-wrap" disabled={isPending} onValueChange={setStatus} value={status}>
          <SelectTabsContent value="export-validated">
            <p>{languageData.ExportValidated}</p>
          </SelectTabsContent>
          <SelectTabsContent value="need-validation">
            <p>{languageData.NeedValidation}</p>
          </SelectTabsContent>
        </SelectTabs>
      </Card>

      <Card className="min-w-60 flex-1 p-4">
        <div className="mb-2 font-semibold">{languageData.RefundMethodHelp}</div>
        <SelectTabs disabled={isPending} onValueChange={setSelectedRefundMethod} value={selectedRefundMethod}>
          {paymentTypesResponse?.map((type: string) => (
            <SelectTabsContent key={type} value={type}>
              <p>{type}</p>
            </SelectTabsContent>
          ))}
          {!paymentTypesResponse && <p className="text-muted-foreground text-sm">{languageData.SelectARefundPoint}</p>}
          {paymentTypesResponse?.length === 0 && (
            <p className="text-muted-foreground text-sm">{languageData.NoPaymentMethodExistsForSelectedRefundPoint}</p>
          )}
        </SelectTabs>
        <PaymentForm
          languageData={languageData}
          refundMethod={selectedRefundMethod as UniRefund_ContractService_Enums_RefundMethod}
        />
      </Card>
    </div>
  );
}

export default RefundFilters;
