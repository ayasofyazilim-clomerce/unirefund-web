import {auth} from "@repo/utils/auth/next-auth";
import {getResourceData} from "src/language-data/unirefund/SSRService";
import Header from "../_components/header";
import ChatwootWidget from "../_components/chatwoot";

export default async function Layout({children, params}: {children: React.ReactNode; params: {lang: string}}) {
  const {lang} = params;

  const {languageData} = await getResourceData(lang);

  const session = await auth();
  return (
    <div className="h-screen overflow-hidden">
      <Header
        availableLocals={process.env.SUPPORTED_LOCALES?.split(",") || []}
        languageData={languageData}
        novu={{
          appId: process.env.NOVU_APP_IDENTIFIER || "",
          appUrl: process.env.NOVU_APP_URL || "",
          subscriberId: session?.user?.sub || "",
        }}
      />
      <main className="h-[calc(100dvh-4rem)] overflow-y-auto bg-white p-0 md:[&:not(:has(.mobile-fullscreen))]:px-8 md:[&:not(:has(.mobile-fullscreen))]:py-6">
        {children}
        <ChatwootWidget
          accessToken={session?.user?.access_token || ""}
          baseUrl={process.env.CHATWOOT_BASE_URL}
          lang={lang}
          name={session?.user?.name || ""}
          surname={session?.user?.surname || ""}
          websiteToken={process.env.CHATWOOT_WEBSITE_TOKEN}
        />
      </main>
    </div>
  );
}
