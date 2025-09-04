"use client";

import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {toast} from "@/components/ui/sonner";
import type {SSRServiceResource} from "@/language-data/unirefund/SSRService";
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
import LivenessTest from "./components/liveness-test";
import PassportScanner from "./components/passport-scanner";

type AuthStep = "start" | "passport-scan" | "liveness-test" | "complete";

interface AuthState {
  currentStep: AuthStep;
  passportData: string | null;
  isComplete: boolean;
  loading: boolean;
}

export default function PassportAuthClient(languageData: SSRServiceResource) {
  const [authState, setAuthState] = useState<AuthState>({
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
    const initializeAuth = async () => {
      setAuthState((prev) => ({...prev, loading: true}));

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
        toast.error(languageData.FailedToInitializeAuthentication + String(error));
      } finally {
        setAuthState((prev) => ({...prev, loading: false}));
      }
    };

    void initializeAuth();
  }, [languageData]);

  const handleStartAuth = () => {
    setAuthState((prev) => ({...prev, currentStep: "passport-scan"}));
  };

  const handlePassportScanned = (passportData: string) => {
    setAuthState((prev) => ({
      ...prev,
      currentStep: "liveness-test",
      passportData,
    }));
  };

  const handleLivenessComplete = () => {
    setAuthState((prev) => ({
      ...prev,
      currentStep: "complete",
      isComplete: true,
    }));
  };

  if (authState.loading || !evidenceSession || !clientAuths) {
    return (
      <div className="h-full">
        <CardContent className="flex items-center justify-center p-6">
          <div className="text-center">
            <div className="border-primary mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-b-2" />
            <p className="text-xs text-gray-600">{languageData.InitializingAuthentication}</p>
          </div>
        </CardContent>
      </div>
    );
  }

  const stepConfig = {
    start: {
      title: languageData.StartValidation,
      description: languageData.PassportOnboardingTitle,
      icon: <FileText className="text-primary h-8 w-8" />,
    },
    "passport-scan": {
      title: languageData.ScanPassport,
      description: languageData.ScanPassportDescription,
      icon: <Camera className="text-primary h-8 w-8" />,
    },
    "liveness-test": {
      title: languageData.LivenessDetection,
      description: languageData.CompleteLivenessVerification,
      icon: <Shield className="text-primary h-8 w-8" />,
    },
    complete: {
      title: languageData.Continue,
      description: languageData.AuthenticationCompletedSuccessfully,
      icon: <CheckCircle className="h-8 w-8 text-green-600" />,
    },
  };

  const currentConfig = stepConfig[authState.currentStep];

  return (
    <div className="flex h-full flex-col">
      {/* Compact Progress Indicator */}
      <div className="mb-4 flex items-center justify-center px-2">
        {(["start", "passport-scan", "liveness-test", "complete"] as const).map((step, index) => {
          const isActive = authState.currentStep === step;
          const isCompleted =
            (step === "start" && authState.currentStep !== "start") ||
            (step === "passport-scan" && authState.passportData !== null) ||
            (step === "liveness-test" && authState.isComplete) ||
            (step === "complete" && authState.isComplete);

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
          {authState.currentStep === "start" && (
            <div className="space-y-3 text-center">
              <p className="mb-4 text-xs text-gray-600">{languageData.PassportTip1}</p>
              <Button className="w-full" onClick={handleStartAuth}>
                {languageData.StartValidation}
              </Button>
            </div>
          )}

          {authState.currentStep === "passport-scan" && (
            <PassportScanner
              evidenceSession={evidenceSession}
              languageData={languageData}
              onPassportScanned={handlePassportScanned}
            />
          )}

          {authState.currentStep === "liveness-test" && authState.passportData ? (
            <LivenessTest
              clientAuths={clientAuths}
              evidenceSessionId={evidenceSession.id || ""}
              languageData={languageData}
              onLivenessComplete={handleLivenessComplete}
              passportImageBase64={authState.passportData}
            />
          ) : null}

          {authState.currentStep === "complete" && (
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
