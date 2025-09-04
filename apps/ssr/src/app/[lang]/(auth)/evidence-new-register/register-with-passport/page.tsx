import {getResourceData} from "src/language-data/unirefund/SSRService";
import PassportRegisterClient from "./client";

interface PassportRegisterPageProps {
  params: {
    lang: string;
  };
}

export default async function PassportRegisterPage({params}: PassportRegisterPageProps) {
  const {languageData} = await getResourceData(params.lang);

  return (
    <div className="flex flex-col">
      {/* Fixed Header */}
      <div className="flex-shrink-0 rounded-lg bg-white px-4 py-3">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-xl font-bold text-gray-900 md:text-2xl">
            {languageData["Auth.RegisterWithPassportPage.Title"]}
          </h1>
          <p className="mt-1 text-xs text-gray-600 md:text-sm">
            {languageData["Auth.RegisterWithPassportPage.Description"]}
          </p>
        </div>
      </div>

      {/* Main Content - Optimized for mobile viewport */}
      <div className="flex-1 overflow-auto px-4 py-3 md:pb-6 md:pt-0">
        <div className="mx-auto h-full max-w-2xl">
          <PassportRegisterClient {...languageData} />
        </div>
      </div>
    </div>
  );
}
