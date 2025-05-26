import {Card} from "@/components/ui/card";
import {getAWSEnvoriment} from "@repo/actions/unirefund/AWSService/actions";
import {getResourceData} from "src/language-data/unirefund/SSRService";
import ValidationSteps from "./_components/validation-steps";

export default async function Home({
  params,
}: {
  params: {
    lang: string;
  };
}) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);
  const clientAuths = await getAWSEnvoriment();
  return (
    <Card className="flex w-full flex-col items-center justify-center gap-4 rounded-lg bg-white p-4 shadow-md md:mx-auto md:max-w-xl">
      <ValidationSteps clientAuths={clientAuths} languageData={languageData} />
    </Card>
  );
}
