"use client";

import {Button} from "@/components/ui/button";
import {Camera} from "lucide-react";
import type {SSRServiceResource} from "@/language-data/unirefund/SSRService";

// Update the component to accept languageData as a prop
export default function HomeButtons({languageData}: {languageData: SSRServiceResource}) {
  return (
    <div className="mt-4 flex w-full flex-col gap-3 text-center">
      <Button className="bg-primary hover:bg-primary/90 flex-1 gap-2">
        <Camera className="h-4 w-4" />
        {languageData.ScanPassport}
      </Button>
      <Button className="flex items-center justify-center gap-2" variant="outline">
        <Camera className="h-4 w-4" />
        {languageData.ScanIDCard}
      </Button>
    </div>
  );
}
