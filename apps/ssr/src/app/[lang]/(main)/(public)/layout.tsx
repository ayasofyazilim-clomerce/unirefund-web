import {getResourceData} from "src/language-data/unirefund/SSRService";
import Header from "./_components/header";

export default async function Layout({children, params}: {children: React.ReactNode; params: {lang: string}}) {
  const {lang} = params;

  const {languageData} = await getResourceData(lang);

  return (
    <div className="grid h-dvh min-h-dvh grid-rows-[4rem,1fr] flex-col overflow-hidden">
      <Header languageData={languageData} />
      <main className="overflow-auto bg-gray-50 p-4">{children}</main>
    </div>
  );
}
