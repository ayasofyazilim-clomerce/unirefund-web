import Image from "next/image";
import Link from "next/link";
import LanguageSelector from "@repo/ui/theme/main-admin-layout/components/language-selector";
import {getBaseLink} from "src/utils";
import unirefundLogo from "public/unirefund.png";

export default function Layout({children, params}: {children: JSX.Element; params: {lang: string}}) {
  return (
    <div className="flex min-h-dvh w-full flex-col">
      <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
        <div className="container flex h-12 items-center justify-between px-4 md:h-14 md:px-8">
          <Link className="flex items-center space-x-2" href={getBaseLink("", params.lang)}>
            <Image alt="UniRefund Logo" height={24} priority src={unirefundLogo.src} width={110} />
          </Link>

          <div className="flex items-center space-x-2">
            <LanguageSelector availableLocals={process.env.SUPPORTED_LOCALES?.split(",") || []} lang={params.lang} />
          </div>
        </div>
      </header>

      <main className="flex flex-1 items-start overflow-y-auto bg-gray-50 px-3 py-3 md:items-center md:px-6 md:py-6">
        <div className="mx-auto w-full max-w-md rounded-lg border border-gray-200 bg-white p-3 shadow-md md:p-5">
          {children}
        </div>
      </main>
    </div>
  );
}
