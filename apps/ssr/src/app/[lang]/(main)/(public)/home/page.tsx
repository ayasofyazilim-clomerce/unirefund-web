"use server";

import {Card} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import PassportMockup from "public/passport-mockup.png";
import {getResourceData} from "src/language-data/core/Default";
import {getBaseLink} from "src/utils";
import HomeButtons from "./client";

export default async function Home({
  params,
}: {
  params: {
    lang: string;
  };
}) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {languageData.ScanYourIdOrPassport || "Scan your ID or Passport"}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {languageData.ScanPassportDescription ||
              "Scan your passport or ID card to find your tax free transactions and add a payment method."}
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

          {/* Client component for interactive buttons */}
          <HomeButtons />

          <div className="text-center">
            <p className="mt-2 text-xs text-gray-500">
              {languageData.PositionDocumentWithinMarkers || "Position your document within the markers"}
            </p>
            <p className="text-sm text-gray-600">
              {languageData.UnableToFindTransactions || "Unable to find your transactions?"}{" "}
              <Link
                className="text-primary hover:text-primary/90 font-medium"
                href={getBaseLink("search-transaction", lang)}>
                {languageData.RefundTracker || "Refund Tracker"}
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
