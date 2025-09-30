import {auth} from "@repo/utils/auth/next-auth";
import {getAllLanguagesApi} from "@repo/actions/core/AdministrationService/actions";
import {getResourceData} from "src/language-data/unirefund/SSRService";
import Header from "../../../_components/header";

export default async function Layout({children, params}: {children: React.ReactNode; params: {lang: string}}) {
  const {lang} = params;

  const {languageData} = await getResourceData(lang);

  const session = await auth();

  const languagesList = await getAllLanguagesApi(session).then((res) => res.data.items || []);

  return (
    <div className="h-dvh min-h-dvh">
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
      <main className="flex h-[calc(100dvh-4rem)] items-center overflow-auto bg-gray-50 p-4">{children}</main>
    </div>
  );
}
