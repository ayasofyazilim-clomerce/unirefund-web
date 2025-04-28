import {getResourceData} from "src/language-data/unirefund/SSRService";
import Header from "./_components/header";

export default async function Layout({children, params}: {children: React.ReactNode; params: {lang: string}}) {
  const {lang} = params;

  const {languageData} = await getResourceData(lang);

  return (
    <div className="flex min-h-screen flex-col">
      <Header languageData={languageData} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
