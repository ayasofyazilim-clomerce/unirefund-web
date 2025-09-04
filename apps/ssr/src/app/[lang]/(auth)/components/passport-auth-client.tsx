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
import LivenessTest from "./liveness-test";
import PassportScanner from "./passport-scanner";

type AuthStep = "start" | "passport-scan" | "liveness-test" | "complete";

interface AuthState {
  currentStep: AuthStep;
  passportData: string | null;
  isComplete: boolean;
  loading: boolean;
}

interface PassportAuthClientProps {
  languageData: SSRServiceResource;
  authType: "login" | "register" | "reset-password";
}

// Helper fonksiyonlar - nested ternary'leri temizlemek için
const getStartDescription = (authType: string, languageData: SSRServiceResource) => {
  if (authType === "login") return languageData.PassportOnboardingTitle;
  if (authType === "register") return languageData["Auth.PassportRegistrationProcess"];
  return languageData["Auth.PassportResetPasswordProcess"];
};

const getPassportScanTitle = (authType: string, languageData: SSRServiceResource) => {
  if (authType === "login") return languageData.ScanPassport;
  return languageData.ScanPassportTitle; // register ve reset için aynı
};

const getPassportScanDescription = (authType: string, languageData: SSRServiceResource) => {
  if (authType === "login") return languageData.ScanPassportDescription;
  if (authType === "register") return languageData["Auth.ScanPassportDescription"];
  return languageData["Auth.ScanPassportResetDescription"];
};

const getLivenessDescription = (authType: string, languageData: SSRServiceResource) => {
  if (authType === "login") return languageData.CompleteLivenessVerification;
  if (authType === "register") return languageData["Auth.CompleteLivenessDescription"];
  return languageData["Auth.CompleteLivenessResetDescription"];
};

const getCompleteDescription = (authType: string, languageData: SSRServiceResource) => {
  if (authType === "login") return languageData.AuthenticationCompletedSuccessfully;
  if (authType === "register") return languageData["Auth.RegistrationCompleted"];
  return languageData["Auth.ResetPasswordCompleted"];
};

const getLoadingMessage = (authType: string, languageData: SSRServiceResource) => {
  if (authType === "login") return languageData.InitializingAuthentication;
  if (authType === "register") return languageData["Auth.InitializingRegistration"];
  return languageData["Auth.InitializingPasswordReset"];
};

const getErrorMessage = (authType: string, languageData: SSRServiceResource) => {
  if (authType === "login") return languageData.FailedToInitializeAuthentication;
  if (authType === "register") return languageData["Auth.FailedToInitializeRegistration"];
  return languageData["Auth.FailedToInitializePasswordReset"];
};

export default function PassportAuthClient({languageData, authType}: PassportAuthClientProps) {
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
        const errorMessage = getErrorMessage(authType, languageData);
        toast.error(errorMessage + String(error));
      } finally {
        setAuthState((prev) => ({...prev, loading: false}));
      }
    };

    void initializeAuth();
  }, [languageData, authType]);

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
    const loadingMessage = getLoadingMessage(authType, languageData);

    return (
      <div className="h-full">
        <CardContent className="flex items-center justify-center p-6">
          <div className="text-center">
            <div className="border-primary mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-b-2" />
            <p className="text-xs text-gray-600">{loadingMessage}</p>
          </div>
        </CardContent>
      </div>
    );
  }

  const stepConfig = {
    start: {
      title: languageData.StartValidation,
      description: getStartDescription(authType, languageData),
      icon: <FileText className="text-primary h-8 w-8" />,
    },
    "passport-scan": {
      title: getPassportScanTitle(authType, languageData),
      description: getPassportScanDescription(authType, languageData),
      icon: <Camera className="text-primary h-8 w-8" />,
    },
    "liveness-test": {
      title: languageData.LivenessDetection,
      description: getLivenessDescription(authType, languageData),
      icon: <Shield className="text-primary h-8 w-8" />,
    },
    complete: {
      title: languageData.Continue,
      description: getCompleteDescription(authType, languageData),
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
