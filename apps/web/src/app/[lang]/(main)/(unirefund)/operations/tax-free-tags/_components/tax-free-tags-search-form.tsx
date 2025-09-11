"use client";

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Card, CardContent} from "@/components/ui/card";
import {Search} from "lucide-react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useState, useTransition} from "react";
import type {TagServiceResource} from "src/language-data/unirefund/TagService";

export default function TaxFreeTagsSearchForm({languageData}: {languageData: TagServiceResource}) {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const tagNumber = searchParams.get("tagNumber") || "";
  const travellerFullName = searchParams.get("travellerFullName") || "";
  const travellerDocumentNo = searchParams.get("travellerDocumentNumber") || "";

  const [travellerDocumentNoInput, setTravellerDocumentNoInput] = useState(travellerDocumentNo);
  const [tagNumberInput, setTagNumberInput] = useState(tagNumber);
  const [travellerFullNameInput, setTravellerFullNameInput] = useState(travellerFullName);
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
    <Card className="rounded-lg border border-gray-200 shadow-none">
      <CardContent className="p-5">
        <form
          className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4"
          data-testid="tax-free-tags-search-form"
          onSubmit={(e) => {
            e.preventDefault();
          }}>
          <div className="space-y-2">
            <Label
              className="font-medium text-gray-700"
              data-testid="traveller-document-no-label"
              htmlFor="traveller-document-no">
              {languageData.TravellerDocumentNo}
            </Label>
            <Input
              className="focus:border-primary border-gray-200"
              data-testid="traveller-document-no-input"
              disabled={isPending}
              id="traveller-document-no"
              name="travellerDocumentNumber"
              onChange={(e) => {
                setTravellerDocumentNoInput(e.target.value);
              }}
              placeholder={languageData.TravellerDocumentNo}
              value={travellerDocumentNoInput}
            />
          </div>

          <div className="space-y-2">
            <Label
              className="font-medium text-gray-700"
              data-testid="traveller-full-name-label"
              htmlFor="traveller-full-name">
              {languageData.TravellerFullName}
            </Label>
            <Input
              className="focus:border-primary border-gray-200"
              data-testid="traveller-full-name-input"
              disabled={isPending}
              id="traveller-full-name"
              name="travellerFullName"
              onChange={(e) => {
                setTravellerFullNameInput(e.target.value);
              }}
              placeholder={languageData.TravellerFullName}
              value={travellerFullNameInput}
            />
          </div>

          <div className="space-y-2">
            <Label className="font-medium text-gray-700" data-testid="tag-number-label" htmlFor="tag-number">
              {languageData.TagNumber}
            </Label>
            <Input
              className="focus:border-primary border-gray-200"
              data-testid="tag-number-input"
              disabled={isPending}
              id="tag-number"
              name="tagNumber"
              onChange={(e) => {
                setTagNumberInput(e.target.value);
              }}
              placeholder={languageData.TagNumber}
              value={tagNumberInput}
            />
          </div>

          <div className="flex items-end">
            <Button
              className="h-10 w-full bg-orange-400 font-medium text-white hover:bg-orange-500"
              data-testid="tax-free-tags-search-button"
              disabled={
                isPending ||
                (travellerDocumentNo === travellerDocumentNoInput &&
                  tagNumber === tagNumberInput &&
                  travellerFullName === travellerFullNameInput)
              }
              onClick={searchForTag}
              type="submit">
              <Search className="mr-2 h-4 w-4" />
              {isPending ? languageData.Searching : languageData.Search}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
