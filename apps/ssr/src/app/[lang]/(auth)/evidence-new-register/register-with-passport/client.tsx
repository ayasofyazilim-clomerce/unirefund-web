"use client";

import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {toast} from "@/components/ui/sonner";
import type {
  UniRefund_TravellerService_EvidenceSessions_EvidenceSessionCreateDto,
  UniRefund_TravellerService_EvidenceSessions_EvidenceSessionDto,
} from "@ayasofyazilim/saas/TravellerService";
import type {AWSAuthConfig} from "@repo/actions/unirefund/AWSService/actions";
import {getAWSEnvoriment} from "@repo/actions/unirefund/AWSService/actions";
import {postCreateEvidenceSessionPublic} from "@repo/actions/unirefund/TravellerService/post-actions";
import {Camera, CheckCircle, FileText, Shield} from "lucide-react";
import Link from "next/link";
import {useParams} from "next/navigation";
import {useEffect, useState} from "react";
import type {SSRServiceResource} from "@/language-data/unirefund/SSRService";
import LivenessTest from "./components/liveness-test";
import PassportScanner from "./components/passport-scanner";

type RegisterStep = "start" | "passport-scan" | "liveness-test" | "complete";

interface RegisterState {
  currentStep: RegisterStep;
  passportData: string | null;
  isComplete: boolean;
  loading: boolean;
}

export default function PassportRegisterClient(languageData: SSRServiceResource) {
  const [registerState, setRegisterState] = useState<RegisterState>({
    currentStep: "start",
    passportData: null,
    isComplete: false,
    loading: false,
  });

  const [evidenceSession, setEvidenceSession] =
    useState<UniRefund_TravellerService_EvidenceSessions_EvidenceSessionDto | null>(null);
  const [clientAuths, setClientAuths] = useState<AWSAuthConfig | null>(null);

  const lang = useParams().lang as string;

  useEffect(() => {
    const initializeRegister = async () => {
      setRegisterState((prev) => ({...prev, loading: true}));

      try {
        const requireSteps: UniRefund_TravellerService_EvidenceSessions_EvidenceSessionCreateDto = {
          isMRZRequired: true,
          isNFCRequired: false,
          isLivenessRequired: true,
          source: "SSR",
        };

        const [evidenceResponse, authsResponse] = await Promise.all([
          postCreateEvidenceSessionPublic({requestBody: requireSteps}),
          getAWSEnvoriment(),
        ]);

        setEvidenceSession(evidenceResponse.data as UniRefund_TravellerService_EvidenceSessions_EvidenceSessionDto);
        setClientAuths(authsResponse as AWSAuthConfig);
      } catch (error) {
        toast.error(languageData["Auth.FailedToInitializeRegistration"] + String(error));
      } finally {
        setRegisterState((prev) => ({...prev, loading: false}));
      }
    };

    void initializeRegister();
  }, [languageData]);

  const handleStartRegister = () => {
    setRegisterState((prev) => ({...prev, currentStep: "passport-scan"}));
  };

  const handlePassportScanned = (passportData: string) => {
    setRegisterState((prev) => ({
      ...prev,
      currentStep: "liveness-test",
      passportData,
    }));
  };

  const handleLivenessComplete = () => {
    setRegisterState((prev) => ({
      ...prev,
      currentStep: "complete",
      isComplete: true,
    }));
  };

  if (registerState.loading || !evidenceSession || !clientAuths) {
    return (
      <div className="h-full">
        <CardContent className="flex items-center justify-center p-6">
          <div className="text-center">
            <div className="border-primary mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-b-2" />
            <p className="text-xs text-gray-600">{languageData["Auth.InitializingRegistration"]}</p>
          </div>
        </CardContent>
      </div>
    );
  }

  const stepConfig = {
    start: {
      title: languageData.StartValidation,
      description: languageData["Auth.PassportRegistrationProcess"],
      icon: <FileText className="text-primary h-8 w-8" />,
    },
    "passport-scan": {
      title: languageData.ScanPassportTitle,
      description: languageData["Auth.ScanPassportDescription"],
      icon: <Camera className="text-primary h-8 w-8" />,
    },
    "liveness-test": {
      title: languageData.LivenessDetection,
      description: languageData["Auth.CompleteLivenessDescription"],
      icon: <Shield className="text-primary h-8 w-8" />,
    },
    complete: {
      title: languageData.Continue,
      description: languageData["Auth.RegistrationCompleted"],
      icon: <CheckCircle className="h-8 w-8 text-green-600" />,
    },
  };

  const currentConfig = stepConfig[registerState.currentStep];

  return (
    <div className="flex h-full flex-col">
      {/* Compact Progress Indicator */}
      <div className="mb-4 flex items-center justify-center px-2">
        {(["start", "passport-scan", "liveness-test", "complete"] as const).map((step, index) => {
          const isActive = registerState.currentStep === step;
          const isCompleted =
            (step === "start" && registerState.currentStep !== "start") ||
            (step === "passport-scan" && registerState.passportData !== null) ||
            (step === "liveness-test" && registerState.isComplete) ||
            (step === "complete" && registerState.isComplete);

          return (
            <div className="flex items-center" key={step}>
              <div
                className={`
                  flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium
                  ${isActive ? "bg-primary text-white" : ""}
                  ${isCompleted ? "bg-primary/20 text-primary" : ""}
                  ${!isActive && !isCompleted ? "bg-gray-200 text-gray-600" : ""}
                `}>
                {index + 1}
              </div>
              {index < 3 && <div className={`mx-1 h-0.5 w-8 ${isCompleted ? "bg-primary/10" : "bg-gray-200"}`} />}
            </div>
          );
        })}
      </div>

      {/* Main Content */}
      <Card className="h-full flex-1">
        <CardHeader className="p-3 pt-2 text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-lg">
            {currentConfig.title}
            {currentConfig.icon}
          </CardTitle>
          <p className="text-xs text-gray-600">{currentConfig.description}</p>
        </CardHeader>
        <CardContent className="flex-1 pb-4">
          {registerState.currentStep === "start" && (
            <div className="space-y-3 text-center">
              <p className="mb-4 text-xs text-gray-600">{languageData.PassportTip1}</p>
              <Button className="w-full" onClick={handleStartRegister}>
                {languageData.StartValidation}
              </Button>
            </div>
          )}

          {registerState.currentStep === "passport-scan" && (
            <PassportScanner
              evidenceSession={evidenceSession}
              languageData={languageData}
              onPassportScanned={handlePassportScanned}
            />
          )}

          {registerState.currentStep === "liveness-test" && registerState.passportData ? (
            <LivenessTest
              clientAuths={clientAuths}
              evidenceSessionId={evidenceSession.id || ""}
              languageData={languageData}
              onLivenessComplete={handleLivenessComplete}
              passportImageBase64={registerState.passportData}
            />
          ) : null}

          {registerState.currentStep === "complete" && (
            <div className="space-y-3 text-center">
              <Link className="mt-3 flex-1" href={`/${lang}`}>
                <Button className="w-full max-w-xs" variant="default">
                  {languageData.Discover}
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
