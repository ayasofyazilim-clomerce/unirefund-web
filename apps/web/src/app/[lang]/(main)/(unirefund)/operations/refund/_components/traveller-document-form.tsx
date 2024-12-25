"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { TagServiceResource } from "src/language-data/unirefund/TagService";

export default function TravellerDocumentForm({
  languageData,
  travellerDocumentNumber,
}: {
  languageData: TagServiceResource;
  travellerDocumentNumber?: string;
}) {
  const router = useRouter();
  const pathName = usePathname();
  const [travellerDocumentNumberInput, setTravellerDocumentNumberInput] =
    useState(travellerDocumentNumber);
  const [isPending, startTransition] = useTransition();

  function searchForTraveller() {
    startTransition(() => {
      router.replace(
        `${pathName}?travellerDocumentNumber=${travellerDocumentNumberInput}`,
      );
    });
  }

  return (
    <form
      className="flex max-w-lg items-end gap-4"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="traveller-document-no">
          {languageData.TravellerDocumentNo}
        </Label>
        <Input
          disabled={isPending}
          id="traveller-document-no"
          name="travellerDocumentNumber"
          onChange={(e) => {
            setTravellerDocumentNumberInput(e.target.value);
          }}
          value={travellerDocumentNumberInput}
        />
      </div>
      <Button
        disabled={
          isPending ||
          !travellerDocumentNumberInput?.length ||
          travellerDocumentNumber === travellerDocumentNumberInput
        }
        onClick={searchForTraveller}
        type="submit"
      >
        {isPending ? languageData.Searching : languageData.Search}
      </Button>
    </form>
  );
}
