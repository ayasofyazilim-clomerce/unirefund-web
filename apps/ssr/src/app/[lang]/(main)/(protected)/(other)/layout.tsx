import {getResourceData} from "src/language-data/unirefund/SSRService";
import Header from "../_components/header";

export default async function Layout({children, params}: {children: React.ReactNode; params: {lang: string}}) {
  const {lang} = params;

  const {languageData} = await getResourceData(lang);
  return (
    <div className="h-screen overflow-hidden">
      <Header availableLocals={process.env.SUPPORTED_LOCALES?.split(",") || []} languageData={languageData} />
      <main className="h-[calc(100dvh-4rem)] overflow-y-auto bg-white p-0 [&:not(:has(.mobile-fullscreen))]:p-6 md:[&:not(:has(.mobile-fullscreen))]:px-8 md:[&:not(:has(.mobile-fullscreen))]:py-6">
        {children}
      </main>
    </div>
  );
}
