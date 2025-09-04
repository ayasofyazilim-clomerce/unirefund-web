import {ArrowRight} from "lucide-react";
import {Button} from "@/components/ui/button";
import Image from "next/image";
import Straight from "public/straight.png";
import type {SSRServiceResource} from "src/language-data/unirefund/SSRService";

export default function OnboardingPage({
  onStartValidation,
  languageData,
}: {
  onStartValidation?: () => void;
  languageData: SSRServiceResource;
}) {
  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-6 space-y-3 text-sm">
        <div className="flex items-center gap-2">
          <p>- {languageData["Liveness.AlignFace"]}</p>
        </div>
        <div className="flex items-center gap-2">
          <p>- {languageData["Liveness.LookAtCamera"]}</p>
        </div>
        <div className="flex items-center gap-2">
          <p>- {languageData["Liveness.StayStill"]}</p>
        </div>
      </div>
      <div className="mb-4 flex justify-center">
        <Image
          alt="Liveness onboarding illustration"
          className="rounded-lg object-contain"
          height={180}
          src={Straight}
          width={140}
        />
      </div>
      <Button className="bg-primary text-primary-foreground w-full" onClick={onStartValidation} size="lg">
        {languageData.StartValidation}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
