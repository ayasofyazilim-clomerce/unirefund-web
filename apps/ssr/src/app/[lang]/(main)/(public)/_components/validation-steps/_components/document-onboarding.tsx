import Image from "next/image";
import {Button} from "@/components/ui/button";
import {StaticImageData} from "next/image";

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
    containerClass = "md:h-auto";
  } else if (type === "id-card-back") {
    containerClass = "max-w-md";
  }

  return (
    <div className={`mx-auto w-full ${containerClass}`}>
      <div className={`mb-5 rounded-xl ${type === "passport" ? " md:p-6 " : "md:p-6"}`}>
        <h2 className="mb-2 hidden text-xl font-bold text-gray-900 md:block">{title}</h2>

        <div className="mb-6 space-y-3 text-sm">
          {tips.map((tip, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="mt-0.5 h-2 w-2 rounded-full bg-gray-400" />
              <p>{tip}</p>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <Image src={imageSrc} alt={title} width={500} height={300} className="mx-auto h-auto max-w-full" />
        </div>

        <Button className="bg-primary text-primary-foreground w-full" onClick={onContinue}>
          {languageData.Continue}
        </Button>
      </div>
    </div>
  );
}
