"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UniRefund_CRMService_Merchants_RefundPointProfileDto } from "@ayasofyazilim/saas/CRMService";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import type { TagServiceResource } from "src/language-data/unirefund/TagService";

export default function TravellerDocumentForm({
  languageData,
  accessibleRefundPoints,
}: {
  languageData: TagServiceResource;
  accessibleRefundPoints: UniRefund_CRMService_Merchants_RefundPointProfileDto[];
}) {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const travellerDocumentNo = searchParams.get("travellerDocumentNumber") || "";
  const refundPointId = searchParams.get("refundPointId") || "";

  const [travellerDocumentNoInput, setTravellerDocumentNoInput] =
    useState(travellerDocumentNo);
  const [refundPointIdInput, setRefundPointId] = useState(refundPointId);
  const [isPending, startTransition] = useTransition();

  function searchForTraveller() {
    startTransition(() => {
      router.replace(
        `${pathName}?travellerDocumentNumber=${travellerDocumentNoInput}&refundPointId=${refundPointIdInput}`,
      );
    });
  }

  return (
    <form
      className="flex items-end gap-4"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className="grid max-w-lg items-center gap-1.5">
        <Label htmlFor="traveller-document-no">
          {languageData.TravellerDocumentNo}
        </Label>
        <Input
          disabled={isPending}
          id="traveller-document-no"
          name="travellerDocumentNumber"
          onChange={(e) => {
            setTravellerDocumentNoInput(e.target.value);
          }}
          value={travellerDocumentNoInput}
        />
      </div>
      <div className="grid max-w-lg items-center gap-1.5">
        <Label htmlFor="refund-point">{languageData.RefundPoint}</Label>
        <Select
          name="refund-point"
          onValueChange={setRefundPointId}
          value={refundPointIdInput}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a refund point" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Refund Points</SelectLabel>
              {accessibleRefundPoints.map((refundPoint) => (
                <SelectItem key={refundPoint.id} value={refundPoint.id || ""}>
                  {refundPoint.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Button
        className="w-24"
        disabled={
          isPending ||
          !travellerDocumentNoInput.length ||
          !refundPointIdInput.length ||
          (travellerDocumentNo === travellerDocumentNoInput &&
            refundPointId === refundPointIdInput)
        }
        onClick={searchForTraveller}
        type="submit"
      >
        {isPending ? languageData.Searching : languageData.Search}
      </Button>
    </form>
  );
}
