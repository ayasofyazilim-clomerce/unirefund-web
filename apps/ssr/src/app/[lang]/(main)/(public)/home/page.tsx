import {Card} from "@/components/ui/card";
import ValidationSteps from "@/app/[lang]/(main)/(public)/_components/validation-steps";
import {getResourceData} from "src/language-data/unirefund/SSRService";

export default async function Home({
  params,
}: {
  params: {
    lang: string;
  };
}) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8">
        {/* <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {languageData.ScanYourIdOrPassport}
          </h1>
          <p className="mt-2 text-sm text-gray-600">{languageData.ScanPassportDescription}</p>
        </div> */}

        <Card className="flex h-[800px] w-[600px] flex-col items-center justify-center gap-4 rounded-lg bg-white p-4 shadow-md">
          <ValidationSteps languageData={languageData} />
        </Card>
      </div>
    </div>
  );
}
