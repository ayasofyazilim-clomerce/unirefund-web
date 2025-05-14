import Image from "next/image";
import Link from "next/link";
import {useParams} from "next/navigation";
import {getBaseLink} from "@/utils";
import type {SSRServiceResource} from "@/language-data/unirefund/SSRService";
import PassportMockup from "public/passport-mockup.png";

export default function Start({languageData}: {languageData: SSRServiceResource}) {
  const {lang} = useParams<{lang: string}>();
  return (
    <div className=" md:h-auto">
      <div className="relative flex w-full justify-center overflow-hidden p-4">
        <Image alt="Scan Placeholder" height={300} priority src={PassportMockup.src} width={400} />
      </div>
      {/* Pass languageData to client component */}

      <div className="text-center">
        <p className="mt-2 text-xs text-gray-500">{languageData.PositionDocumentWithinMarkers}</p>
        <p className="text-sm text-gray-600">
          {languageData.UnableToFindTransactions}{" "}
          <Link
            className="text-primary hover:text-primary/90 font-medium"
            href={getBaseLink("search-transaction", lang)}>
            {languageData.RefundTracker}
          </Link>
        </p>
      </div>
    </div>
  );
}
