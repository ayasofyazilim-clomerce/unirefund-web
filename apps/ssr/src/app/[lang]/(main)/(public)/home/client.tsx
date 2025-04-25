"use client";

import {Button} from "@/components/ui/button";
import {Camera} from "lucide-react";
import {useParams} from "next/navigation";
import {getResourceDataClient} from "src/language-data/core/Default";

export default function HomeButtons() {
  // URL'den dil parametresini al
  const params = useParams();
  const lang = params.lang as string;

  // Dil kaynaklarını istemci tarafında al
  const languageData = getResourceDataClient(lang);

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
