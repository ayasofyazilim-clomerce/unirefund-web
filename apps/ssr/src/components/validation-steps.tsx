"use client";
import {Button} from "@/components/ui/button";
import type {SSRServiceResource} from "@/language-data/unirefund/SSRService";
import type {
  UniRefund_TravellerService_EvidenceSessions_EvidenceSessionCreateDto,
  UniRefund_TravellerService_EvidenceSessions_EvidenceSessionDto,
} from "@ayasofyazilim/saas/TravellerService";
import type {AWSAuthConfig} from "@repo/actions/unirefund/AWSService/actions";
import {defineStepper} from "@stepperize/react";
import {ArrowLeft, ArrowRight, Camera, CheckCircle, FileText, Shield} from "lucide-react";
import type {ParseResult} from "mrz";
import {useEffect, useState} from "react";
import LivenessDetector from "./liveness-detector";
import SuccessModal from "./validation-steps/finish";
import RegisterChoice from "./validation-steps/register-choice";
import ScanDocument from "./validation-steps/scan-document";
import Start from "./validation-steps/start";

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
  {id: "register-choice", title: "ChooseRegistration", icon: <FileText className="h-5 w-5" />},
  {id: "start", title: "StartValidation", icon: <FileText className="h-5 w-5" />},
  {id: "scan-front", title: "IDCardFront", icon: <Camera className="h-5 w-5" />},
  {id: "scan-back", title: "IDCardBack", icon: <Camera className="h-5 w-5" />},
  {id: "scan-passport", title: "ScanPassport", icon: <Camera className="h-5 w-5" />},
  {id: "liveness-detector", title: "LivenessDetector", icon: <Shield className="h-5 w-5" />},
  {id: "fail", title: "LivenessFailed", icon: <Shield className="h-5 w-5" />},
  {id: "finish", title: "Continue", icon: <CheckCircle className="h-5 w-5" />},
);

export default function ValidationSteps({
  languageData,
  clientAuths,
  requireSteps,
  responseCreateEvidence,
}: {
  languageData: SSRServiceResource;
  clientAuths: AWSAuthConfig;
  requireSteps: UniRefund_TravellerService_EvidenceSessions_EvidenceSessionCreateDto;
  responseCreateEvidence: UniRefund_TravellerService_EvidenceSessions_EvidenceSessionDto;
}) {
  const [canGoNext, setCanGoNext] = useState(false);
  const [front, setFront] = useState<DocumentData>(null);
  const [back, setBack] = useState<DocumentData>(null);
  const [progress, setProgress] = useState(0);
  // Extract session ID from API response
  const [evidenceSession, setEvidenceSession] = useState<string | null>(responseCreateEvidence.id || null);

  // Update progress based on current step
  const updateProgress = (currentStep: number, totalSteps: number) => {
    const newProgress = Math.round((currentStep / (totalSteps - 1)) * 100);
    setProgress(newProgress);
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      <GlobalScopper.Scoped>
        <StepperContent
          back={back}
          canGoNext={canGoNext}
          clientAuths={clientAuths}
          front={front}
          languageData={languageData}
          progress={progress}
          requireSteps={requireSteps}
          evidenceSession={evidenceSession}
          setBack={setBack}
          setCanGoNext={setCanGoNext}
          setFront={setFront}
          setEvidenceSession={setEvidenceSession}
          updateProgress={updateProgress}
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
  requireSteps,
  evidenceSession,
  setEvidenceSession,
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
  requireSteps: UniRefund_TravellerService_EvidenceSessions_EvidenceSessionCreateDto;
  evidenceSession: string | null;
  setEvidenceSession: (value: string | null) => void;
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
    <div className="">
      {/* Progress indicator - Hide only on first step */}
      {/* Steps indicators - Show on all pages */}
      {!stepper.isFirst && (
        <div className="-mb-2 lg:mb-8">
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
              style={{width: `${progress}%`}}
            />
          </div>
        </div>
      )}
      {/* Step content */}{" "}
      <Steps
        back={back}
        clientAuths={clientAuths}
        front={front}
        languageData={languageData}
        requireSteps={requireSteps}
        evidenceSession={evidenceSession}
        setBack={setBack}
        setCanGoNext={setCanGoNext}
        setFront={setFront}
        setEvidenceSession={setEvidenceSession}
      />
      {/* Navigation buttons */}{" "}
      <Actions
        back={back}
        canGoNext={canGoNext}
        front={front}
        languageData={languageData}
        requireSteps={requireSteps}
        setCanGoNext={setCanGoNext}
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
  evidenceSession,
  setEvidenceSession,
}: {
  languageData: SSRServiceResource;
  stepper: ReturnType<typeof GlobalScopper.useStepper>;
  setCanGoNext: (value: boolean) => void;
  clientAuths: AWSAuthConfig;
  front: DocumentData;
  evidenceSession: string | null;
  setEvidenceSession: (value: string | null) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  if (!evidenceSession) return <div>test</div>;

  const handleAnalysisComplete = async (result: {isLive: boolean}) => {
    if (!result.isLive || !front?.base64) {
      failSession();
      return <div>test2</div>;
    }
    // ...isteğe bağlı: burada yüz karşılaştırma işlemi yapılabilir...
    stepper.goTo("finish");
  };

  const handleError = () => {
    setCanGoNext(false);
    stepper.goTo("fail");
  };

  const failSession = () => {
    stepper.goTo("fail");
  };

  return (
    <div className="relative h-full w-full">
      {isLoading ? (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-neutral-900/70">
          <div className="border-primary mb-4 h-12 w-12 animate-spin rounded-full border-4 border-t-transparent" />
          <h3 className="text-lg font-semibold text-white">{languageData.VerifyingYourIdentity}</h3>
          <p className="mt-2 text-sm text-neutral-200">{languageData.PleaseWaitWhileWeVerify}</p>
        </div>
      ) : null}
      sdfsd
      <LivenessDetector
        config={clientAuths}
        languageData={languageData}
        onAnalysisComplete={(result) => {
          void handleAnalysisComplete(result);
        }}
        evidenceSessionId={evidenceSession}
        frontImageBase64={front?.base64 || null}
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
  requireSteps,
  evidenceSession,
  setEvidenceSession,
}: {
  front: DocumentData;
  back: DocumentData;
  setFront: (value: DocumentData) => void;
  setBack: (value: DocumentData) => void;
  languageData: SSRServiceResource;
  setCanGoNext: (value: boolean) => void;
  clientAuths: AWSAuthConfig;
  requireSteps: UniRefund_TravellerService_EvidenceSessions_EvidenceSessionCreateDto;
  evidenceSession: string | null;
  setEvidenceSession: (value: string | null) => void;
}) {
  const stepper = GlobalScopper.useStepper();
  // Determine which steps to show based on requireSteps
  const showMRZSteps = requireSteps.isMRZRequired !== false;
  const showLivenessStep = requireSteps.isLivenessRequired !== false;
  return (
    <div>
      {stepper.when("register-choice", () => (
        <RegisterChoice languageData={languageData} stepper={stepper} />
      ))}
      {stepper.when("start", () => (
        <Start />
      ))}
      {/* Show MRZ steps only if isMRZRequired is true */}
      {showMRZSteps
        ? stepper.when("scan-front", () => (
            <ScanDocument
              session={evidenceSession || ""}
              back={back}
              front={front}
              languageData={languageData}
              setBack={setBack}
              setCanGoNext={setCanGoNext}
              setFront={setFront}
              type="id-card-front"
            />
          ))
        : null}
      {showMRZSteps
        ? stepper.when("scan-back", () => (
            <ScanDocument
              session={evidenceSession || ""}
              back={back}
              front={front}
              languageData={languageData}
              setBack={setBack}
              setCanGoNext={setCanGoNext}
              setFront={setFront}
              type="id-card-back"
            />
          ))
        : null}{" "}
      {showMRZSteps
        ? stepper.when("scan-passport", () => (
            <ScanDocument
              session={evidenceSession || ""}
              back={back}
              front={front}
              languageData={languageData}
              setBack={setBack}
              setCanGoNext={setCanGoNext}
              setFront={setFront}
              type="passport"
            />
          ))
        : null}
      {/* Show liveness detector only if isLivenessRequired is true */}
      {showLivenessStep
        ? stepper.when("liveness-detector", () => (
            <LivenessStep
              clientAuths={clientAuths}
              front={front}
              languageData={languageData}
              evidenceSession={evidenceSession}
              setCanGoNext={setCanGoNext}
              setEvidenceSession={setEvidenceSession}
              stepper={stepper}
            />
          ))
        : null}
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
        <SuccessModal languageData={languageData} />
      ))}
    </div>
  );
}

function Actions({
  canGoNext,
  setCanGoNext,
  front,
  back,
  languageData,
  requireSteps,
}: {
  canGoNext: boolean;
  setCanGoNext: (value: boolean) => void;
  front: DocumentData;
  back: DocumentData;
  languageData: SSRServiceResource;
  requireSteps: UniRefund_TravellerService_EvidenceSessions_EvidenceSessionCreateDto;
}) {
  const stepper = GlobalScopper.useStepper();

  // Determine which steps to show based on requireSteps
  const showMRZSteps = requireSteps.isMRZRequired !== false;
  const showLivenessStep = requireSteps.isLivenessRequired !== false;
  return !stepper.isLast ? (
    <div className="flex items-center justify-between">
      {" "}
      {!stepper.isFirst && stepper.current.id !== "start" && (
        <Button
          className="border-black/20 px-5 py-2.5 text-black hover:bg-black/5"
          onClick={() => {
            // Özel yönlendirme kuralları
            if (stepper.current.id === "scan-back") {
              stepper.goTo("scan-front");
              // ID kartı ön yüzü taranmışsa, ileri butonunu aktif bırak
              setCanGoNext(Boolean(front?.base64));
            } else if (
              stepper.current.id === "liveness-detector" &&
              (stepper.metadata as StepperMetadata).documentType === "id-card"
            ) {
              stepper.goTo("scan-back");
              // ID kartı arka yüzü taranmışsa, ileri butonunu aktif bırak
              setCanGoNext(Boolean(back?.base64));
            } else if (
              stepper.current.id === "liveness-detector" &&
              (stepper.metadata as StepperMetadata).documentType === "passport"
            ) {
              stepper.goTo("scan-passport");
              // Pasaport taranmışsa, ileri butonunu aktif bırak
              setCanGoNext(Boolean(front?.base64));
            } else if (stepper.current.id === "scan-passport") {
              stepper.goTo("start");
              setCanGoNext(false);
            } else if (stepper.current.id === "start") {
              stepper.goTo("register-choice");
              setCanGoNext(false);
            } else {
              stepper.prev();
              setCanGoNext(false);
            }
          }}
          variant="outline">
          <ArrowLeft className="mr-2 h-5 w-5" />
          {languageData.Previous}
        </Button>
      )}{" "}
      {stepper.when(
        "register-choice",
        () =>
          // No buttons for register-choice - they are in the component
          null,
      )}
      {stepper.when("start", () => (
        <div className="flex w-full flex-col gap-3 md:items-center md:justify-center">
          {/* Only show document scan options if MRZ is required */}
          {showMRZSteps ? (
            <>
              <Button
                className="w-full bg-red-600 px-5 py-2.5 text-white hover:bg-red-700 md:w-full"
                onClick={() => {
                  stepper.goTo("scan-passport");
                  // Type-safe way to set metadata
                  const typedSetMetadata = stepper.setMetadata as unknown as (value: Partial<StepperMetadata>) => void;
                  typedSetMetadata({documentType: "passport"});
                }}>
                <FileText className="mr-2 h-5 w-5" />
                {languageData.StartValidationWithPassport || "Start validation with passport"}
              </Button>

              <Button
                className="w-full border-red-600 px-5 py-2.5 text-red-600 hover:bg-red-50 md:w-full"
                onClick={() => {
                  stepper.goTo("scan-front");
                  // Type-safe way to set metadata
                  const typedSetMetadata = stepper.setMetadata as unknown as (value: Partial<StepperMetadata>) => void;
                  typedSetMetadata({documentType: "id-card"});
                }}
                variant="outline">
                <Camera className="mr-2 h-5 w-5" />
                {languageData.StartValidationWithIDCard || "Start validation with ID card"}
              </Button>
            </>
          ) : (
            // If MRZ not required, show a single button to proceed directly to liveness detector
            <Button
              className="bg-primary hover:bg-primary/90 w-full px-5 py-2.5 md:w-full"
              onClick={() => {
                stepper.goTo("liveness-detector");
              }}>
              <Shield className="mr-2 h-5 w-5" />
              {languageData.StartValidation}
            </Button>
          )}

          {/* {!session && (
            <div className="mt-2 text-center">
              <Link
                className="hover:text-primary flex items-center  justify-center gap-1 text-sm text-gray-500"
                href={getBaseLink("login", lang)}>
                {languageData.AlreadyHaveAnAccount}
                <LogIn className="inline h-4 w-4" />
              </Link>
            </div>
          )} */}
        </div>
      ))}
      {!stepper.isFirst && !stepper.when("start", () => true) && (
        <Button
          className="bg-primary hover:bg-primary/90 px-5 py-2.5"
          // disabled={!canGoNext}
          onClick={() => {
            // Handle navigation based on requireSteps and current step
            if (!showMRZSteps && stepper.current.id === "start") {
              // Skip MRZ steps if not required
              stepper.goTo("liveness-detector");
            } else if (
              stepper.current.id === "scan-front" &&
              (stepper.metadata as StepperMetadata).documentType === "id-card"
            ) {
              stepper.goTo("scan-back");
            } else if (stepper.current.id === "scan-back" || stepper.current.id === "scan-passport") {
              // Go directly to liveness detector after document scan
              stepper.goTo("liveness-detector");
            } else if (!showLivenessStep) {
              // Skip liveness detection if not required
              stepper.goTo("finish");
            } else {
              stepper.next();
            }
            setCanGoNext(false);
          }}>
          {languageData.Next}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      )}
    </div>
  ) : null;
}
