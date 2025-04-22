"use client";

import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {Camera} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import PassportMockup from "public/passport-mockup.png";

export default function HomeClient() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Scan your ID or Passport</h1>
          <p className="mt-2 text-sm text-gray-600">
            Scan your passport or ID card to find your tax free transactions and add a payment method.
          </p>
        </div>

        <Card className="flex w-full flex-col items-center justify-center gap-4 rounded-lg bg-white p-6 shadow-md">
          <div className="relative aspect-[4/3] w-full overflow-hidden p-4">
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {/* Corner markers for scanning indication */}
              <div className="pointer-events-none absolute inset-0">
                {/* Top left corner */}
                <div className="border-primary absolute left-2 top-2 h-8 w-8 border-l-2 border-t-2" />
                {/* Top right corner */}
                <div className="border-primary absolute right-2 top-2 h-8 w-8 border-r-2 border-t-2" />
                {/* Bottom left corner */}
                <div className="border-primary absolute bottom-2 left-2 h-8 w-8 border-b-2 border-l-2" />
                {/* Bottom right corner */}
                <div className="border-primary absolute bottom-2 right-2 h-8 w-8 border-b-2 border-r-2" />
              </div>

              <div className="relative z-10 max-w-full">
                <Image alt="Scan Placeholder" height={300} priority src={PassportMockup.src} width={400} />
              </div>
            </div>
          </div>

          <div className="mt-4 flex w-full flex-col gap-3 text-center">
            <Button className="bg-primary hover:bg-primary/90 flex-1 gap-2" type="submit">
              <Camera className="h-4 w-4" />
              Scan Passport
            </Button>
            <Button className="flex items-center justify-center gap-2" type="button" variant="outline">
              <Camera className="h-4 w-4" />
              Scan ID Card
            </Button>
            <p className="mt-2 text-xs text-gray-500">Position your document within the markers</p>
            <p className="text-sm text-gray-600">
              Unable to find your transactions?{" "}
              <Link className="text-primary hover:text-primary/90 font-medium" href="/search-transaction">
                Refund Tracker
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
