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
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="w-full space-y-8 landscape:lg:max-w-md">
        {/* <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {languageData.ScanYourIdOrPassport}
          </h1>
          <p className="mt-2 text-sm text-gray-600">{languageData.ScanPassportDescription}</p>
        </div> */}

        <Card className="flex w-full flex-col items-center justify-center gap-4 rounded-lg bg-white p-4 shadow-md ">
          <ValidationSteps languageData={languageData} />
        </Card>
      </div>
    </div>
  );
}
