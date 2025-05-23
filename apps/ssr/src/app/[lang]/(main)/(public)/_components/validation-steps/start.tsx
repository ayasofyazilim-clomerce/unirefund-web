import Image from "next/image";
import Link from "next/link";
import {useParams} from "next/navigation";
import {getBaseLink} from "@/utils";
import type {SSRServiceResource} from "@/language-data/unirefund/SSRService";
import PassportMockup from "public/passport-mockup.png";
import {ReceiptText} from "lucide-react";

export default function Start({languageData}: {languageData: SSRServiceResource}) {
  const {lang} = useParams<{lang: string}>();
  return (
    <div className=" md:h-auto">
      <div className="relative flex w-full justify-center overflow-hidden p-4">
        <Image alt="Scan Placeholder" height={300} priority src={PassportMockup.src} width={400} />
      </div>
      {/* Pass languageData to client component */}

      <div className="text-center">
        <div className="mx-auto flex max-w-md flex-wrap items-center justify-center gap-1">
          <p className="inline-flex items-center text-sm text-gray-500">{languageData.UnableToFindTransactions} </p>
          <Link
            className="hover:text-primary inline-flex items-center gap-1 text-sm text-gray-500"
            href={getBaseLink("search-transaction", lang)}>
            {languageData.RefundTracker}
            <ReceiptText className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
