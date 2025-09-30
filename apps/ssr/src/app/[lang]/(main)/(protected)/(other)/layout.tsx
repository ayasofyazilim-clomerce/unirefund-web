import {auth} from "@repo/utils/auth/next-auth";
import {getAllLanguagesApi} from "@repo/actions/core/AdministrationService/actions";
import {getResourceData} from "src/language-data/unirefund/SSRService";
import Header from "../_components/header";
import ChatwootWidget from "../_components/chatwoot";

export default async function Layout({children, params}: {children: React.ReactNode; params: {lang: string}}) {
  const {lang} = params;

  const {languageData} = await getResourceData(lang);

  const session = await auth();

  const languagesList = await getAllLanguagesApi(session).then((res) => res.data.items || []);

  return (
    <div className="h-screen overflow-hidden">
      <Header
        availableLocals={process.env.SUPPORTED_LOCALES?.split(",") || []}
        languageData={languageData}
        languagesList={languagesList}
        novu={{
          appId: process.env.NOVU_APP_IDENTIFIER || "",
          appUrl: process.env.NOVU_APP_URL || "",
          subscriberId: session?.user?.sub || "",
        }}
      />
      <main className="h-[calc(100dvh-4rem)] overflow-y-auto bg-white p-0 md:[&:not(:has(.mobile-fullscreen))]:px-8 md:[&:not(:has(.mobile-fullscreen))]:py-6">
        {children}
        <ChatwootWidget
          baseUrl={process.env.CHATWOOT_BASE_URL}
          lang={lang}
          session={session}
          websiteToken={process.env.CHATWOOT_WEBSITE_TOKEN}
        />
      </main>
    </div>
  );
}
