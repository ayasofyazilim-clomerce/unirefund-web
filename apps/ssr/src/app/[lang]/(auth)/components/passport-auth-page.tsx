import {getResourceData} from "src/language-data/unirefund/SSRService";
import PassportAuthClient from "./passport-auth-client";

interface PassportAuthPageProps {
  params: {
    lang: string;
  };
  authType: "login" | "register";
}

export default async function PassportAuthPage({params, authType}: PassportAuthPageProps) {
  const {languageData} = await getResourceData(params.lang);

  const isLogin = authType === "login";

  const headerTitle = isLogin ? languageData.ScanPassport : languageData["Auth.RegisterWithPassportPage.Title"];

  const headerDescription = isLogin
    ? languageData.ScanPassportDescription
    : languageData["Auth.RegisterWithPassportPage.Description"];

  return (
    <div className="flex flex-col">
      {/* Fixed Header */}
      <div className="flex-shrink-0 rounded-lg bg-white px-4 py-3">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-xl font-bold text-gray-900 md:text-2xl">{headerTitle}</h1>
          <p className="mt-1 text-xs text-gray-600 md:text-sm">{headerDescription}</p>
        </div>
      </div>

      {/* Main Content - Optimized for mobile viewport */}
      <div className="flex-1 overflow-auto px-4 py-3 md:pb-6 md:pt-0">
        <div className="mx-auto h-full max-w-2xl">
          <PassportAuthClient authType={authType} languageData={languageData} />
        </div>
      </div>
    </div>
  );
}
