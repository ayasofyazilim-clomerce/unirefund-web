import Image from "next/image";
import Link from "next/link";
import LanguageSelector from "@repo/ui/theme/main-admin-layout/components/language-selector";
import {auth} from "@repo/utils/auth/next-auth";
import {redirect} from "next/navigation";
import {getBaseLink} from "src/utils";
import {getResourceData} from "src/language-data/core/AccountService";
import unirefundLogo from "public/unirefund.png";

export default async function Layout({children, params}: {children: JSX.Element; params: {lang: string}}) {
  const session = await auth();
  if (session) {
    redirect(getBaseLink("home", params.lang));
  }

  const {languageData} = await getResourceData(params.lang);
  return (
    <div className="min-h-screen">
      <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
        <div className="container flex h-12 items-center justify-between px-4 md:h-14 md:px-8">
          <Link className="flex items-center space-x-2" href={getBaseLink("", params.lang)}>
            <Image
              alt={languageData["Common.UniRefundLogoAlt"]}
              height={24}
              priority
              src={unirefundLogo.src}
              width={110}
            />
          </Link>

          <div className="flex items-center space-x-2">
            <LanguageSelector
              availableLocals={process.env.SUPPORTED_LOCALES?.split(",") || []}
              lang={params.lang}
              showEarthIcon
            />
          </div>
        </div>
      </header>

      <main className="bg-gray-50 p-3 md:flex md:min-h-[calc(100vh-3rem)] md:items-center md:p-6">
        <div className="mx-auto w-full max-w-3xl rounded-lg border border-gray-200 bg-white shadow-md">{children}</div>
      </main>
    </div>
  );
}
