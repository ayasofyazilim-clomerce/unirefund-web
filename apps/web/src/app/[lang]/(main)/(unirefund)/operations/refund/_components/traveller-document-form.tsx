"use client";

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import type {UniRefund_CRMService_RefundPoints_RefundPointListResponseDto} from "@repo/saas/CRMService";
import {Combobox} from "@repo/ayasofyazilim-ui/molecules/combobox";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useState, useTransition} from "react";
import {useSession} from "@repo/utils/auth";
import type {TagServiceResource} from "src/language-data/unirefund/TagService";

export default function TravellerDocumentForm({
  languageData,
  accessibleRefundPoints,
}: {
  languageData: TagServiceResource;
  accessibleRefundPoints: UniRefund_CRMService_RefundPoints_RefundPointListResponseDto[];
}) {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const {session} = useSession();

  const tagIds = searchParams.get("tagIds") || "";
  const travellerDocumentNo = searchParams.get("travellerDocumentNumber") || "";
  const refundPointId =
    session?.user?.RefundPointId ||
    accessibleRefundPoints.find((i) => i.id === searchParams.get("refundPointId"))?.id ||
    "";
  const [travellerDocumentNoInput, setTravellerDocumentNoInput] = useState(travellerDocumentNo);
  const [tagIdInput, setTagIdInput] = useState(tagIds);
  const [refundPointIdInput, setRefundPointIdInput] = useState<
    UniRefund_CRMService_RefundPoints_RefundPointListResponseDto | null | undefined
  >(accessibleRefundPoints.find((i) => i.id === refundPointId) || null);
  const [isPending, startTransition] = useTransition();

  function searchForTraveller() {
    startTransition(() => {
      const newSearchParams = new URLSearchParams();

      const params = {
        travellerDocumentNumber: travellerDocumentNoInput,
        tagIds: tagIdInput,
        refundPointId: refundPointIdInput?.id,
      };

      Object.entries(params).forEach(([key, value]) => {
        if (value) newSearchParams.set(key, value);
      });
      router.push(`${pathName}?${newSearchParams.toString()}`);
    });
  }

  return (
    <form
      className="grid w-full items-end gap-4 rounded-lg border border-gray-200 p-4 md:grid-cols-4 md:justify-center"
      data-testid="traveller-document-form"
      onSubmit={(e) => {
        e.preventDefault();
      }}>
      <div className="flex w-full flex-col gap-1.5">
        <Label data-testid="traveller-document-no-label" htmlFor="traveller-document-no">
          {languageData.TravellerDocumentNo}
        </Label>
        <Input
          data-testid="traveller-document-no-input"
          disabled={isPending}
          id="traveller-document-no"
          name="travellerDocumentNumber"
          onChange={(e) => {
            setTravellerDocumentNoInput(e.target.value);
          }}
          value={travellerDocumentNoInput}
        />
      </div>
      <div className="flex w-full flex-col gap-1.5">
        <Label data-testid="traveller-tagid-label" htmlFor="traveller-tagid">
          {languageData.TaxFreeTagID}
        </Label>
        <Input
          data-testid="traveller-tagid-input"
          disabled={isPending}
          id="traveller-tagid"
          onChange={(e) => {
            setTagIdInput(e.target.value);
          }}
          value={tagIdInput}
        />
      </div>
      <div className="flex w-full flex-col gap-1.5 overflow-hidden">
        <Label data-testid="refund-point-label" htmlFor="refund-point">
          {languageData.RefundPoint}
        </Label>
        <Combobox<UniRefund_CRMService_RefundPoints_RefundPointListResponseDto>
          id="refund-point-list"
          list={accessibleRefundPoints}
          onValueChange={setRefundPointIdInput}
          selectIdentifier="id"
          selectLabel="name"
          value={refundPointIdInput}
        />
      </div>
      <Button
        className="px-12"
        data-testid="search-button"
        disabled={
          isPending ||
          !travellerDocumentNoInput.length ||
          !refundPointIdInput?.id ||
          (travellerDocumentNo === travellerDocumentNoInput &&
            refundPointId === refundPointIdInput.id &&
            tagIds === tagIdInput)
        }
        onClick={searchForTraveller}
        type="submit">
        {isPending ? languageData.Searching : languageData.Search}
      </Button>
    </form>
  );
}
