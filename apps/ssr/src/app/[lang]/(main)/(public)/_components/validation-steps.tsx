"use client";
import {Button} from "@/components/ui/button";
import {defineStepper} from "@stepperize/react";
import type {ParseResult} from "mrz";
import {useState, useEffect} from "react";
import type {SSRServiceResource} from "@/language-data/unirefund/SSRService";
import ScanDocument from "./validation-steps/scan-document";
import Start from "./validation-steps/start";
import TakeSelfie from "./validation-steps/take-selfie";
import SuccessModal from "./validation-steps/finish";
import {CheckCircle, Camera, FileText, Shield, User, ArrowLeft, ArrowRight, RotateCcw} from "lucide-react";
import LivenessDetector from "./liveness-detector";
import {AWSAuthConfig, createFaceLivenessSession, postCompareFaces} from "@repo/actions/unirefund/AWSService/actions";

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

interface CompareFacesResponse {
  faceMatches: {
    similarity: number;
  }[];
}

// Updated steps with larger icons
const GlobalScopper = defineStepper(
  {id: "start", title: "StartValidation", icon: <FileText className="h-5 w-5" />},
  {id: "scan-front", title: "IDCardFront", icon: <Camera className="h-5 w-5" />},
  {id: "scan-back", title: "IDCardBack", icon: <Camera className="h-5 w-5" />},
  {id: "scan-passport", title: "ScanPassport", icon: <Camera className="h-5 w-5" />},
  {id: "take-selfie", title: "TakeSelfie", icon: <User className="h-5 w-5" />},
  {id: "liveness-detector", title: "LivenessDetector", icon: <Shield className="h-5 w-5" />},
  {id: "fail", title: "LivenessFailed", icon: <Shield className="h-5 w-5" />},
  {id: "finish", title: "Continue", icon: <CheckCircle className="h-5 w-5" />},
);

export default function ValidationSteps({
  languageData,
  clientAuths,
}: {
  languageData: SSRServiceResource;
  clientAuths: AWSAuthConfig;
}) {
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
          clientAuths={clientAuths}
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
  clientAuths,
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
  clientAuths: AWSAuthConfig;
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

    // Handle fail step specially - it should have the same progress as liveness-detector
    const failStepIndex = stepper.all.findIndex((s) => s.id === "fail");
    const livenessStepIndex = stepper.all.findIndex((s) => s.id === "liveness-detector");
    const finishStepIndex = stepper.all.findIndex((s) => s.id === "finish");

    let effectiveIndex = currentIndex;
    if (currentIndex === failStepIndex) {
      effectiveIndex = livenessStepIndex;
    } else if (currentIndex === finishStepIndex) {
      // For finish step, make it 100%
      const totalSteps = stepper.all.length - 1;
      updateProgress(totalSteps - 1, totalSteps - 1); // This will make it 100%
      return;
    }

    const totalSteps = stepper.all.length - 1; // Exclude fail step from total count
    updateProgress(effectiveIndex, totalSteps);
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

                // Check if we're in the fail step and keep the same index as liveness-detector
                // Also handle finish step to show as the final step
                const failStepIndex = stepper.all.findIndex((s) => s.id === "fail");
                const livenessStepIndex = stepper.all.findIndex((s) => s.id === "liveness-detector");
                const finishStepIndex = stepper.all.findIndex((s) => s.id === "finish");

                if (currentIndex === failStepIndex) {
                  displayIndex = livenessStepIndex;
                }

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

                // Calculate total steps excluding start, unused scan options, and fail step
                const totalSteps = isIdCardFlow
                  ? stepper.all.length - 3 // Exclude start, scan-passport, and fail
                  : stepper.all.length - 4; // Exclude start, scan-front, scan-back, and fail

                // For finish step, always show it as the final step
                if (currentIndex === finishStepIndex) {
                  return `${totalSteps}/${totalSteps}`;
                }

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
        clientAuths={clientAuths}
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

// LivenessStep bileşeni Steps fonksiyonu dışına çıkarıldı
function LivenessStep({
  languageData,
  stepper,
  setCanGoNext,
  clientAuths,
  front,
}: {
  languageData: SSRServiceResource;
  stepper: ReturnType<typeof GlobalScopper.useStepper>;
  setCanGoNext: (value: boolean) => void;
  clientAuths: AWSAuthConfig;
  front: DocumentData;
}) {
  const [session, setSession] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    void createFaceLivenessSession().then((sessionId: string) => {
      setSession(sessionId);
    });
  }, []);

  if (!session) return null;

  return (
    <div className="relative h-full w-full">
      {isLoading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-neutral-900/70">
          <div className="border-primary mb-4 h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"></div>
          <h3 className="text-lg font-semibold text-white">{languageData.VerifyingYourIdentity}</h3>
          <p className="mt-2 text-sm text-neutral-200">{languageData.PleaseWaitWhileWeVerify}</p>
        </div>
      )}
      <LivenessDetector
        languageData={languageData}
        sessionId={session}
        onAnalysisComplete={(result) => {
          void (async () => {
            if (result.isLive) {
              if (front?.base64) {
                try {
                  setIsLoading(true); // Show loading overlay
                  const compareResult = await postCompareFaces(session, front.base64);
                  setIsLoading(false); // Hide loading overlay

                  if (compareResult.data) {
                    const responseData = compareResult.data as CompareFacesResponse;
                    const isSimilarityHigh =
                      responseData.faceMatches.length > 0 && responseData.faceMatches[0].similarity > 80;

                    if (isSimilarityHigh) {
                      stepper.goTo("finish");
                    } else {
                      setSession("");
                      stepper.goTo("fail");
                    }
                  } else {
                    setSession("");
                    stepper.goTo("fail");
                  }
                } catch (error) {
                  setIsLoading(false); // Hide loading overlay in case of error
                  setSession("");
                  stepper.goTo("fail");
                }
              } else {
                setSession("");
                stepper.goTo("fail");
              }
            } else {
              setSession("");
              stepper.goTo("fail");
            }
          })();
        }}
        onError={() => {
          setCanGoNext(false);
          stepper.goTo("fail");
        }}
        config={clientAuths}
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
  clientAuths,
}: {
  front: DocumentData;
  back: DocumentData;
  setFront: (value: DocumentData) => void;
  setBack: (value: DocumentData) => void;
  languageData: SSRServiceResource;
  setCanGoNext: (value: boolean) => void;
  clientAuths: AWSAuthConfig;
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

      {stepper.when("liveness-detector", () => (
        <LivenessStep
          languageData={languageData}
          stepper={stepper}
          setCanGoNext={setCanGoNext}
          clientAuths={clientAuths}
          front={front}
        />
      ))}

      {stepper.when("fail", () => (
        <div className="flex flex-col items-center justify-center space-y-6 p-4">
          <div className="rounded-full bg-red-50 p-4">
            <Shield className="h-12 w-12 text-red-500" />
          </div>
          <h3 className="text-center text-xl font-semibold">
            {languageData.LivenessFailed || "Liveness verification failed"}
          </h3>
          <p className="text-center text-gray-600">
            {languageData.LivenessFailedDescription ||
              "We couldn't verify that you're a real person. Please try again."}
          </p>
          <Button
            className="bg-primary hover:bg-primary/90 mt-4 px-5 py-2.5"
            onClick={() => {
              stepper.goTo("liveness-detector");
            }}>
            {languageData.TryAgain || "Try Again"}
          </Button>
        </div>
      ))}

      {stepper.when("finish", () => (
        <SuccessModal
          languageData={languageData}
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
