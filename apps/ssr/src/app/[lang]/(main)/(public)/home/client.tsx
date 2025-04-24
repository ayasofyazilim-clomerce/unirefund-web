"use client";

import {Button} from "@/components/ui/button";
import {Camera} from "lucide-react";

export default function HomeButtons() {
  return (
    <div className="mt-4 flex w-full flex-col gap-3 text-center">
      <Button className="bg-primary hover:bg-primary/90 flex-1 gap-2">
        <Camera className="h-4 w-4" />
        Scan Passport
      </Button>
      <Button className="flex items-center justify-center gap-2" variant="outline">
        <Camera className="h-4 w-4" />
        Scan ID Card
      </Button>
    </div>
  );
}
