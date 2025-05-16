import {ArrowRight} from "lucide-react";
import {Button} from "@/components/ui/button";
import Image from "next/image";
import Straight from "public/straight.png";

export default function OnboardingPage({onStartValidation}: {onStartValidation?: () => void}) {
  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-6 space-y-3 text-sm">
        <div className="flex items-center gap-2">
          <div className="mt-0.5 h-2 w-2 rounded-full bg-gray-400" />
          <p>Yüzünüzü ekrandaki çerçeveye hizalayın.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="mt-0.5 h-2 w-2 rounded-full bg-gray-400" />
          <p>Kameraya bakın ve ekrandaki yönergeleri takip edin.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="mt-0.5 h-2 w-2 rounded-full bg-gray-400" />
          <p>Kısa bir süre sabit durarak canlılık testinin tamamlanmasını bekleyin.</p>
        </div>
      </div>
      <div className="mb-4 flex justify-center">
        <Image
          src={Straight}
          height={180}
          width={140}
          alt="Liveness onboarding illustration"
          className="rounded-lg object-contain"
        />
      </div>
      <Button className="bg-primary text-primary-foreground w-full" size="lg" onClick={onStartValidation}>
        Doğrulamayı Başlat
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
