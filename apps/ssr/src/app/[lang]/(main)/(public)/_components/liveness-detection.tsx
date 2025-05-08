"use client";
import {WebcamCapture} from "./webcam";
import {useCallback, useEffect, useState} from "react";
import {SSRServiceResource} from "@/language-data/unirefund/SSRService";
import {Button} from "@/components/ui/button";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {CheckCircleIcon, XCircleIcon, TimerIcon, ScanFaceIcon} from "lucide-react";

type LivenessStep =
  | "instructions"
  | "lookStraight"
  | "turnLeft"
  | "turnRight"
  | "blink"
  | "smile"
  | "processing"
  | "success"
  | "failure";

export function LivenessDetection({
  onComplete,
  languageData,
}: {
  onComplete: (imageSrc: string) => void;
  languageData: SSRServiceResource;
}) {
  const [currentStep, setCurrentStep] = useState<LivenessStep>("instructions");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);

  // Helper to reset timeout when changing steps
  const setStepWithTimeout = useCallback(
    (step: LivenessStep, nextStep: LivenessStep, delay: number) => {
      setCurrentStep(step);

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      const id = setTimeout(() => {
        setCurrentStep(nextStep);
      }, delay);

      setTimeoutId(id);

      return () => {
        clearTimeout(id);
      };
    },
    [timeoutId],
  );

  // Handle image capture
  const handleImage = useCallback((imageSrc: string | null) => {
    if (imageSrc) {
      setCapturedImage(imageSrc);
    }
  }, []);

  // Progress through liveness steps
  useEffect(() => {
    let cleanupFn: (() => void) | undefined;

    switch (currentStep) {
      case "instructions":
        // User needs to click button to start
        break;
      case "lookStraight":
        cleanupFn = setStepWithTimeout("lookStraight", "turnLeft", 3000);
        break;
      case "turnLeft":
        cleanupFn = setStepWithTimeout("turnLeft", "turnRight", 3000);
        break;
      case "turnRight":
        cleanupFn = setStepWithTimeout("turnRight", "blink", 3000);
        break;
      case "blink":
        cleanupFn = setStepWithTimeout("blink", "smile", 3000);
        break;
      case "smile":
        cleanupFn = setStepWithTimeout("smile", "processing", 3000);
        break;
      case "processing":
        cleanupFn = setStepWithTimeout("processing", "success", 2000);
        break;
      case "success":
        if (capturedImage) {
          onComplete(capturedImage);
        }
        break;
      case "failure":
        // User needs to click to try again
        break;
    }

    return () => {
      if (cleanupFn) cleanupFn();
    };
  }, [currentStep, setStepWithTimeout, capturedImage, onComplete]);

  // Reset the process
  const handleReset = useCallback(() => {
    setCapturedImage(null);
    setCurrentStep("instructions");
  }, []);

  // Get instruction text based on current step
  const getInstructionText = () => {
    switch (currentStep) {
      case "instructions":
        return languageData["LivenessDetection.Instructions"];
      case "lookStraight":
        return languageData["LivenessDetection.LookStraight"];
      case "turnLeft":
        return languageData["LivenessDetection.TurnLeft"];
      case "turnRight":
        return languageData["LivenessDetection.TurnRight"];
      case "blink":
        return languageData["LivenessDetection.Blink"];
      case "smile":
        return languageData["LivenessDetection.Smile"];
      case "processing":
        return languageData["LivenessDetection.Processing"];
      case "success":
        return languageData["LivenessDetection.Success"];
      case "failure":
        return languageData["LivenessDetection.Failure"];
      default:
        return "";
    }
  };

  const getAlertClass = (step: string) => {
    switch (step) {
      case "success":
        return "border-green-200 bg-green-50";
      case "failure":
        return "border-red-200 bg-red-50";
      default:
        return "border-blue-200 bg-blue-50";
    }
  };

  const getAlertIcon = (step: string) => {
    switch (step) {
      case "success":
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case "failure":
        return <XCircleIcon className="h-4 w-4 text-red-500" />;
      case "processing":
        return <TimerIcon className="h-4 w-4 animate-spin text-blue-500" />;
      default:
        return <ScanFaceIcon className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Alert className={`${getAlertClass(currentStep)} mx-auto max-w-md`}>
        <div className="flex items-center gap-2">
          {getAlertIcon(currentStep)}
          <AlertTitle className="text-sm font-medium">
            {currentStep === "instructions" ? languageData.LivenessDetection : getInstructionText()}
          </AlertTitle>
        </div>
        <AlertDescription className="mt-2 text-sm">
          {currentStep === "instructions" ? languageData.LivenessDetectionDescription : ""}
        </AlertDescription>
      </Alert>

      <div className="w-full max-w-md">
        <WebcamCapture
          type="selfie"
          handleImage={handleImage}
          capturedImage={capturedImage}
          allowCameraSwitch={false}
          placeholder={
            <div className="flex flex-col items-center justify-center text-white">
              <div className="text-center text-xs opacity-70">{getInstructionText()}</div>
            </div>
          }
        />
      </div>

      <div className="flex justify-center space-x-4">
        {currentStep === "instructions" && (
          <Button
            onClick={() => {
              setCurrentStep("lookStraight");
            }}
            className="bg-primary text-white">
            {languageData["LivenessDetection.TryAgain"] || languageData.StartValidation}
          </Button>
        )}

        {currentStep === "failure" && (
          <Button onClick={handleReset} className="bg-primary text-white">
            {languageData["LivenessDetection.TryAgain"]}
          </Button>
        )}

        {currentStep === "success" && (
          <Button
            onClick={() => {
              capturedImage && onComplete(capturedImage);
            }}
            className="bg-green-600 text-white hover:bg-green-700">
            {languageData.Continue}
          </Button>
        )}
      </div>
    </div>
  );
}
