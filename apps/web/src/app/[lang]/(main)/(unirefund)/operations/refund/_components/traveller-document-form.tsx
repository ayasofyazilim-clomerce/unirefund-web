"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import type { TagServiceResource } from "src/language-data/unirefund/TagService";

export default function TravellerDocumentForm({
  languageData,
}: {
  languageData: TagServiceResource;
}) {
  const router = useRouter();
  const pathName = usePathname();
  const [travellerDocumentNumber, setTravellerDocumentNumber] = useState("");
  function searchForTraveller() {
    router.replace(
      `${pathName}?travellerDocumentNumber=${travellerDocumentNumber}`,
    );
  }

  return (
    <div className="flex max-w-lg items-end gap-4">
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="picture">{languageData.TravellerDocumentNo}</Label>
        <Input
          name="travellerDocumentNumber"
          onChange={(e) => {
            setTravellerDocumentNumber(e.target.value);
          }}
          value={travellerDocumentNumber}
        />
      </div>

      <Button onClick={searchForTraveller} type="submit">
        {languageData.Search}
      </Button>
    </div>
  );
}
