"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { UniRefund_CRMService_Merchants_RefundPointProfileDto } from "@ayasofyazilim/saas/CRMService";
import { Check, ChevronsUpDown } from "lucide-react";
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
  const refundPointId =
    accessibleRefundPoints.find(
      (i) => i.id === searchParams.get("refundPointId"),
    )?.id || "";

  const [travellerDocumentNoInput, setTravellerDocumentNoInput] =
    useState(travellerDocumentNo);
  const [refundPointIdInput, setRefundPointIdInput] = useState(refundPointId);
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
        <Popover>
          <PopoverTrigger asChild>
            <Button
              className="w-[200px] justify-between"
              role="combobox"
              variant="outline"
            >
              {refundPointIdInput
                ? accessibleRefundPoints.find(
                    (refundPoint) => refundPoint.id === refundPointIdInput,
                  )?.name
                : languageData["Select.EmptyValue"]}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput
                className="h-9"
                placeholder={languageData["Select.Placeholder"]}
              />
              <CommandList>
                <CommandEmpty>{languageData["Select.EmptyValue"]}</CommandEmpty>
                <CommandGroup>
                  {accessibleRefundPoints.map((refundPoint) => (
                    <CommandItem
                      key={refundPoint.id}
                      onSelect={(currentValue) => {
                        setRefundPointIdInput(
                          currentValue === refundPointIdInput
                            ? ""
                            : currentValue,
                        );
                      }}
                      value={refundPoint.id || ""}
                    >
                      {refundPoint.name}
                      <Check
                        className={cn(
                          "ml-auto",
                          refundPointIdInput === refundPoint.id
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
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
