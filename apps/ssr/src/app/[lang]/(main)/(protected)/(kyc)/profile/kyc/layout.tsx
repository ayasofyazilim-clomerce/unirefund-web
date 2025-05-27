import {getResourceData} from "src/language-data/unirefund/SSRService";
import Header from "../../../_components/header";

export default async function Layout({children, params}: {children: React.ReactNode; params: {lang: string}}) {
  const {lang} = params;

  const {languageData} = await getResourceData(lang);

  return (
    <div className="h-dvh min-h-dvh">
      <Header availableLocals={process.env.SUPPORTED_LOCALES?.split(",") || []} languageData={languageData} />
      <main className="flex h-[calc(100dvh-4rem)] items-center overflow-auto bg-gray-50 p-4">{children}</main>
    </div>
  );
}
