"use client";

import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Button} from "@/components/ui/button";
import type {AWSAuthConfig} from "@repo/actions/unirefund/AWSService/actions";
import {AlertCircle, CheckCircle} from "lucide-react";
import Image from "next/image";
import {useState} from "react";
import Selfie from "public/selfie.png";
import type {SSRServiceResource} from "@/language-data/unirefund/SSRService";
import LivenessDetector from "@/components/liveness-detector";

interface LivenessTestProps {
  languageData: SSRServiceResource;
  evidenceSessionId: string;
  clientAuths: AWSAuthConfig;
  passportImageBase64: string;
  onLivenessComplete: () => void;
}

type LivenessStatus = "idle" | "testing" | "success" | "failed";

export default function LivenessTest({
  languageData,
  evidenceSessionId,
  clientAuths,
  passportImageBase64,
  onLivenessComplete,
}: LivenessTestProps) {
  const [livenessStatus, setLivenessStatus] = useState<LivenessStatus>("idle");
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [confidence, setConfidence] = useState<number>(0);

  const handleLivenessResult = (result: {isLive: boolean; confidence: number}) => {
    setConfidence(result.confidence);

    if (result.isLive && result.confidence > 80) {
      setLivenessStatus("success");
      setTimeout(() => {
        onLivenessComplete();
      }, 2000);
    } else {
      setLivenessStatus("failed");
    }
  };

  const handleRetry = () => {
    setLivenessStatus("idle");
    setShowOnboarding(true);
    setConfidence(0);
  };

  if (showOnboarding) {
    return (
      <div className="flex h-full flex-col space-y-6">
        {/* Main content area with improved layout */}
        <div className="flex flex-1 flex-col items-center gap-6 md:flex-row">
          {/* Left side - Instructions */}
          <div className="w-full flex-1 space-y-4">
            <div className="space-y-3 text-xs text-gray-600">
              <div className="mb-2 text-base font-semibold text-gray-800">{languageData.MakeSureFaceWellLit}</div>

              <div className="space-y-3">
                <p className="leading-relaxed text-gray-700">- {languageData.SelfieTip1}</p>
                <p className="leading-relaxed text-gray-700">- {languageData.SelfieTip2}</p>
                <p className="leading-relaxed text-gray-700">- {languageData.SelfieTip3}</p>
              </div>
            </div>
            {/* Bottom button */}
            <Button
              className="h-7 w-full bg-red-600 hover:bg-red-700 md:w-4/5"
              onClick={() => {
                setShowOnboarding(false);
                setLivenessStatus("testing");
              }}>
              {languageData.LivenessDetection}
            </Button>
          </div>

          {/* Right side - Selfie example - Much larger */}
          <div className="flex w-full flex-1 items-center justify-center md:w-auto">
            <Image
              alt={languageData.SelfieExample}
              className="h-auto w-full max-w-[200px] md:max-w-[360px]"
              height={160}
              src={Selfie}
              width={240}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {livenessStatus === "testing" && (
        <div className="flex w-full justify-center">
          {/* <Alert className="border-gray-200 bg-white">
            <Shield className="h-4 w-4 text-black" />
            <AlertTitle className="text-black">{languageData.LivenessDetection}</AlertTitle>
            <AlertDescription className="text-xs text-black">
              {languageData.FollowInstructionsToComplete}
            </AlertDescription>
          </Alert> */}

          <LivenessDetector
            config={clientAuths}
            evidenceSessionId={evidenceSessionId}
            frontImageBase64={passportImageBase64}
            languageData={languageData}
            onAnalysisComplete={handleLivenessResult}
            onStartTesting={() => {
              setLivenessStatus("testing");
            }}
            trigger={<Button className="w-full  bg-red-600 hover:bg-red-700">{languageData.LivenessDetection}</Button>}
          />
        </div>
      )}

      {livenessStatus === "success" && (
        <div className="space-y-3 text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">{languageData.LivenessDetectionSuccessful}</AlertTitle>
            <AlertDescription className="text-xs text-green-700">
              Confidence: {confidence}% - {languageData.IdentityVerifiedSuccessfully}
            </AlertDescription>
          </Alert>
          <p className="text-xs text-gray-600">{languageData.RedirectingToComplete}</p>
        </div>
      )}

      {livenessStatus === "failed" && (
        <div className="space-y-3">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{languageData.LivenessDetectionFailed}</AlertTitle>
            <AlertDescription className="text-xs">
              {confidence > 0
                ? `Confidence: ${confidence}% - ${languageData.BelowRequiredThreshold}`
                : languageData.UnableToVerifyLiveness}
            </AlertDescription>
          </Alert>

          <div className="flex gap-2">
            <Button className="flex-1" onClick={handleRetry} size="sm" variant="outline">
              {languageData.TryAgain || "Try Again"}
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                window.history.back();
              }}
              size="sm"
              variant="ghost">
              {languageData.Cancel || "Cancel"}
            </Button>
          </div>
        </div>
      )}

      {livenessStatus === "idle" && (
        <div className="text-center">
          <div className="border-primary mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-b-2" />
          <p className="text-xs text-gray-600">{languageData.PreparingLivenessDetection}</p>
        </div>
      )}
    </div>
  );
}
