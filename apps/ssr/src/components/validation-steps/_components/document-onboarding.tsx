import type {StaticImageData} from "next/image";
import Image from "next/image";
import {Button} from "@/components/ui/button";

interface OnboardingProps {
  type: string;
  imageSrc: string | StaticImageData;
  tips: string[];
  title: string;
  onContinue: () => void;
  languageData: {
    Continue: string;
  };
}

export default function DocumentOnboarding({type, imageSrc, tips, title, onContinue, languageData}: OnboardingProps) {
  let containerClass = "";

  if (type === "passport") {
    containerClass = "md:h-1/2";
  } else if (type === "id-card-back") {
    containerClass = "max-w-md";
  }

  return (
    <div className={`mx-auto w-full ${containerClass}`}>
      <div
        className={`mb-4 rounded-xl lg:mb-2 ${type === "passport" ? " lg:px-4 lg:pb-6 lg:pt-2 " : "lg:px-4 lg:pb-6 lg:pt-2"}`}>
        <div className="mb-2 space-y-3 text-sm">
          {tips.map((tip, index) => (
            <div className="flex items-center gap-2" key={index}>
              <div className="mt-0.5 h-2 w-2 rounded-full bg-gray-400" />
              <p>{tip}</p>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <Image alt={title} className="mx-auto h-auto max-w-full" height={300} src={imageSrc} width={500} />
        </div>

        <Button className="bg-primary text-primary-foreground w-full" onClick={onContinue}>
          {languageData.Continue}
        </Button>
      </div>
    </div>
  );
}
