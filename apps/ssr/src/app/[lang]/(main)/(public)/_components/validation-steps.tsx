"use client";
import {Button} from "@/components/ui/button";
import {defineStepper} from "@stepperize/react";
import type {ParseResult} from "mrz";
import {useState, useEffect} from "react";
import type {SSRServiceResource} from "@/language-data/unirefund/SSRService";
import LivenessDedection from "./validation-steps/liveness-dedection";
import ScanDocument from "./validation-steps/scan-document";
import Start from "./validation-steps/start";
import TakeSelfie from "./validation-steps/take-selfie";
import SuccessModal from "./validation-steps/finish";
import {CheckCircle, Camera, FileText, Shield, User, ArrowLeft, ArrowRight, RotateCcw} from "lucide-react";

// Define the type for stepper metadata
interface StepperMetadata {
  documentType?: "id-card" | "passport";
}

export type StepProps = {
  step: {id: string; title: string; description: string};
  languageData: SSRServiceResource;
};

export type DocumentData = {
  base64: string | null;
  data: ParseResult["fields"] | null;
} | null;

// Updated steps with larger icons
const GlobalScopper = defineStepper(
  {id: "start", title: "StartValidation", icon: <FileText className="h-5 w-5" />},
  {id: "scan-front", title: "IDCardFront", icon: <Camera className="h-5 w-5" />},
  {id: "scan-back", title: "IDCardBack", icon: <Camera className="h-5 w-5" />},
  {id: "scan-passport", title: "ScanPassport", icon: <Camera className="h-5 w-5" />},
  {id: "take-selfie", title: "TakeSelfie", icon: <User className="h-5 w-5" />},
  {id: "liveness-dedection", title: "LivenessDetection", icon: <Shield className="h-5 w-5" />},
  {id: "finish", title: "Continue", icon: <CheckCircle className="h-5 w-5" />},
);

export default function ValidationSteps({languageData}: {languageData: SSRServiceResource}) {
  const [canGoNext, setCanGoNext] = useState(false);
  const [front, setFront] = useState<DocumentData>(null);
  const [back, setBack] = useState<DocumentData>(null);
  const [progress, setProgress] = useState(0);

  // Update progress based on current step
  const updateProgress = (currentStep: number, totalSteps: number) => {
    const newProgress = Math.round((currentStep / (totalSteps - 1)) * 100);
    setProgress(newProgress);
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      <GlobalScopper.Scoped>
        <StepperContent
          languageData={languageData}
          canGoNext={canGoNext}
          setCanGoNext={setCanGoNext}
          front={front}
          back={back}
          setFront={setFront}
          setBack={setBack}
          updateProgress={updateProgress}
          progress={progress}
        />
      </GlobalScopper.Scoped>
    </div>
  );
}

// Separated component to use the stepper hook
function StepperContent({
  languageData,
  canGoNext,
  setCanGoNext,
  front,
  back,
  setFront,
  setBack,
  updateProgress,
  progress,
}: {
  languageData: SSRServiceResource;
  canGoNext: boolean;
  setCanGoNext: (value: boolean) => void;
  front: DocumentData;
  back: DocumentData;
  setFront: (value: DocumentData) => void;
  setBack: (value: DocumentData) => void;
  updateProgress: (currentStep: number, totalSteps: number) => void;
  progress: number;
}) {
  const stepper = GlobalScopper.useStepper();

  // Update progress when step changes
  useEffect(() => {
    const currentIndex = stepper.all.findIndex((step) => step.id === stepper.current.id);
    updateProgress(currentIndex, stepper.all.length);
  }, [stepper.current.id, stepper, updateProgress]);

  return (
    <div className="space-y-6">
      {/* Progress indicator - Hide only on first step */}
      {/* Steps indicators - Show on all pages */}

      {!stepper.isFirst && (
        <div className="-mb-2 md:mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-black">
              {languageData[stepper.current.title as keyof SSRServiceResource] || stepper.current.title}
            </h2>
            <span className="text-sm font-medium text-black">
              {(() => {
                // Get the current step index based on the flow
                const currentIndex = stepper.all.findIndex((step) => step.id === stepper.current.id);

                // Total number of steps based on flow type
                const isIdCardFlow = (stepper.metadata as StepperMetadata).documentType === "id-card";

                // Calculate the logical step number for display
                let displayIndex = currentIndex;

                // For ID card flow, adjust to remove scan-passport from count
                // For passport flow, adjust to remove scan-front and scan-back from count
                if (isIdCardFlow) {
                  // In ID card flow, remove scan-passport from step count
                  if (currentIndex > stepper.all.findIndex((s) => s.id === "scan-passport")) {
                    displayIndex -= 1;
                  }
                } else {
                  // In passport flow, remove scan-front and scan-back from step count
                  if (currentIndex > stepper.all.findIndex((s) => s.id === "scan-front")) {
                    displayIndex -= 1;
                  }
                  if (currentIndex > stepper.all.findIndex((s) => s.id === "scan-back")) {
                    displayIndex -= 1;
                  }
                }

                // Calculate total steps excluding start and unused scan options
                const totalSteps = isIdCardFlow
                  ? stepper.all.length - 2 // Exclude start and scan-passport
                  : stepper.all.length - 3; // Exclude start, scan-front, and scan-back

                return `${displayIndex}/${totalSteps}`;
              })()}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-black/10">
            <div
              className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
              style={{width: `${progress}%`}}></div>
          </div>
        </div>
      )}

      {/* Step content */}
      <Steps
        back={back}
        front={front}
        languageData={languageData}
        setBack={setBack}
        setCanGoNext={setCanGoNext}
        setFront={setFront}
      />

      {/* Navigation buttons */}
      <Actions
        canGoNext={canGoNext}
        languageData={languageData}
        setBack={setBack}
        setCanGoNext={setCanGoNext}
        setFront={setFront}
        front={front}
        back={back}
      />
    </div>
  );
}

function Steps({
  front,
  back,
  setFront,
  setBack,
  languageData,
  setCanGoNext,
}: {
  front: DocumentData;
  back: DocumentData;
  setFront: (value: DocumentData) => void;
  setBack: (value: DocumentData) => void;
  languageData: SSRServiceResource;
  setCanGoNext: (value: boolean) => void;
}) {
  const stepper = GlobalScopper.useStepper();

  return (
    <div>
      {stepper.when("start", () => (
        <Start languageData={languageData} />
      ))}

      {stepper.when("scan-front", () => (
        <ScanDocument
          back={back}
          front={front}
          languageData={languageData}
          setBack={setBack}
          setCanGoNext={setCanGoNext}
          setFront={setFront}
          type="id-card-front"
        />
      ))}

      {stepper.when("scan-back", () => (
        <ScanDocument
          back={back}
          front={front}
          languageData={languageData}
          setBack={setBack}
          setCanGoNext={setCanGoNext}
          setFront={setFront}
          type="id-card-back"
        />
      ))}

      {stepper.when("scan-passport", () => (
        <ScanDocument
          back={back}
          front={front}
          languageData={languageData}
          setBack={setBack}
          setCanGoNext={setCanGoNext}
          setFront={setFront}
          type="passport"
        />
      ))}

      {stepper.when("take-selfie", () => {
        if (!front?.base64) return null;
        return <TakeSelfie documentSrc={front.base64} languageData={languageData} setCanGoNext={setCanGoNext} />;
      })}

      {stepper.when("liveness-dedection", () => (
        <LivenessDedection languageData={languageData} setCanGoNext={setCanGoNext} front={front} />
      ))}

      {stepper.when("finish", () => (
        <SuccessModal
          onRestart={() => {
            stepper.reset();
            setCanGoNext(false);
            setBack(null);
            setFront(null);
          }}
        />
      ))}
    </div>
  );
}

function Actions({
  canGoNext,
  setCanGoNext,
  setFront,
  setBack,
  front,
  back,
  languageData,
}: {
  canGoNext: boolean;
  setCanGoNext: (value: boolean) => void;
  setFront: (value: DocumentData) => void;
  setBack: (value: DocumentData) => void;
  front: DocumentData;
  back: DocumentData;
  languageData: SSRServiceResource;
}) {
  const stepper = GlobalScopper.useStepper();

  return !stepper.isLast ? (
    <div className="flex items-center justify-between">
      {!stepper.isFirst && (
        <Button
          disabled={stepper.isFirst}
          onClick={() => {
            // Özel yönlendirme kuralları
            if (stepper.current.id === "scan-back") {
              stepper.goTo("scan-front");
              // ID kartı ön yüzü taranmışsa, ileri butonunu aktif bırak
              setCanGoNext(Boolean(front?.base64));
            } else if (
              stepper.current.id === "take-selfie" &&
              (stepper.metadata as StepperMetadata).documentType === "id-card"
            ) {
              stepper.goTo("scan-back");
              // ID kartı arka yüzü taranmışsa, ileri butonunu aktif bırak
              setCanGoNext(Boolean(back?.base64));
            } else if (
              stepper.current.id === "take-selfie" &&
              (stepper.metadata as StepperMetadata).documentType === "passport"
            ) {
              stepper.goTo("scan-passport");
              // Pasaport taranmışsa, ileri butonunu aktif bırak
              setCanGoNext(Boolean(front?.base64));
            } else if (stepper.current.id === "scan-passport") {
              stepper.goTo("start");
              setCanGoNext(false);
            } else {
              stepper.prev();
              setCanGoNext(false);
            }
          }}
          variant="outline"
          className="border-black/20 px-5 py-2.5 text-black hover:bg-black/5">
          <ArrowLeft className="mr-2 h-5 w-5" />
          {languageData.Previous}
        </Button>
      )}

      {stepper.when("start", () => (
        <div className="flex w-full flex-col gap-3 md:items-center md:justify-center">
          <Button
            className="bg-primary hover:bg-primary/90 w-full px-5 py-2.5 md:w-full"
            onClick={() => {
              stepper.goTo("scan-passport");
              // Type-safe way to set metadata
              const typedSetMetadata = stepper.setMetadata as unknown as (value: Partial<StepperMetadata>) => void;
              typedSetMetadata({documentType: "passport"});
            }}>
            <FileText className="mr-2 h-5 w-5" />
            {languageData.StartValidationWithPassport}
          </Button>

          <Button
            className="border-primary text-primary hover:bg-primary/5 w-full px-5 py-2.5 md:w-full"
            onClick={() => {
              stepper.goTo("scan-front");
              // Type-safe way to set metadata
              const typedSetMetadata = stepper.setMetadata as unknown as (value: Partial<StepperMetadata>) => void;
              typedSetMetadata({documentType: "id-card"});
            }}
            variant="outline">
            <Camera className="mr-2 h-5 w-5" />
            {languageData.StartValidationWithIDCard}
          </Button>
        </div>
      ))}

      {!stepper.isFirst && !stepper.when("start", () => true) && (
        <Button
          disabled={!canGoNext}
          onClick={() => {
            // ID kartı akışında özel yönlendirme kuralları
            if (
              stepper.current.id === "scan-front" &&
              (stepper.metadata as StepperMetadata).documentType === "id-card"
            ) {
              stepper.goTo("scan-back");
            } else if (stepper.current.id === "scan-back" || stepper.current.id === "scan-passport") {
              stepper.goTo("take-selfie");
            } else {
              stepper.next();
            }
            setCanGoNext(false);
          }}
          className="bg-primary hover:bg-primary/90 px-5 py-2.5">
          {languageData.Next}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      )}
    </div>
  ) : (
    <div className="flex items-center gap-3">
      <Button
        onClick={() => {
          stepper.reset();
          setCanGoNext(false);
          setBack(null);
          setFront(null);
        }}
        className="bg-primary hover:bg-primary/90 px-5 py-2.5">
        <RotateCcw className="mr-2 h-5 w-5" />
        {languageData.Reset}
      </Button>
    </div>
  );
}
