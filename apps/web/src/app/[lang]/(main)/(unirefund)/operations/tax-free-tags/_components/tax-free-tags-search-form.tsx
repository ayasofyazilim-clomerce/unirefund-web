"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import type { TagServiceResource } from "src/language-data/unirefund/TagService";

export default function TaxFreeTagsSearchForm({
  languageData,
}: {
  languageData: TagServiceResource;
}) {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const tagNumber = searchParams.get("tagNumber") || "";
  const travellerFullName = searchParams.get("travellerFullName") || "";
  const travellerDocumentNo = searchParams.get("travellerDocumentNumber") || "";

  const [travellerDocumentNoInput, setTravellerDocumentNoInput] =
    useState(travellerDocumentNo);
  const [tagNumberInput, setTagNumberInput] = useState(tagNumber);
  const [travellerFullNameInput, setTravellerFullNameInput] =
    useState(travellerFullName);
  const [isPending, startTransition] = useTransition();

  function searchForTag() {
    startTransition(() => {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set("tagNumber", tagNumberInput);
      newSearchParams.set("travellerDocumentNoInput", travellerDocumentNoInput);
      newSearchParams.set("travellerFullName", travellerFullNameInput);

      router.replace(`${pathName}?${newSearchParams.toString()}`);
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
        <Label htmlFor="traveller-document-no">
          {languageData.TravellerFullName}
        </Label>
        <Input
          disabled={isPending}
          id="traveller-full-name"
          name="travellerFullName"
          onChange={(e) => {
            setTravellerFullNameInput(e.target.value);
          }}
          value={travellerFullNameInput}
        />
      </div>
      <div className="grid max-w-lg items-center gap-1.5">
        <Label htmlFor="traveller-document-no">{languageData.TagNumber}</Label>
        <Input
          disabled={isPending}
          id="tag-number"
          name="tagNumber"
          onChange={(e) => {
            setTagNumberInput(e.target.value);
          }}
          value={tagNumberInput}
        />
      </div>

      <Button
        className="w-24"
        disabled={
          isPending ||
          (travellerDocumentNo === travellerDocumentNoInput &&
            tagNumber === tagNumberInput &&
            travellerFullName === travellerFullNameInput)
        }
        onClick={searchForTag}
        type="submit"
      >
        {isPending ? languageData.Searching : languageData.Search}
      </Button>
    </form>
  );
}
