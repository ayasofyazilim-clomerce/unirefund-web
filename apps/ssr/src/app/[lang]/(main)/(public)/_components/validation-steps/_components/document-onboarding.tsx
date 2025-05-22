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
      <div className={`mb-5 rounded-xl ${type === "passport" ? " lg:p-6 " : "lg:p-6"}`}>
        <h2 className="mb-2 hidden text-xl font-bold text-gray-900 lg:block">{title}</h2>

        <div className="mb-6 space-y-3 text-sm">
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
