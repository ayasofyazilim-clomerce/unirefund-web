"use client";

import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogHeader} from "@/components/ui/dialog";
import {toast} from "@/components/ui/sonner";
import type {UniRefund_TravellerService_EvidenceSessions_EvidenceSessionDto} from "@repo/saas/TravellerService";
import {detectFace} from "@repo/actions/unirefund/AWSService/actions";
import {postApiTravellerServiceEvidenceSessionPublicAnalyzeDocumentByMrz} from "@repo/actions/unirefund/TravellerService/post-actions";
import {AlertCircle, Camera, CheckCircle} from "lucide-react";
import Image from "next/image";
import {useState} from "react";
import PassportMRZ from "public/Passport.png";
import type {SSRServiceResource} from "@/language-data/unirefund/SSRService";
import {WebcamCapture} from "@/components/webcam";

interface PassportScannerProps {
  languageData: SSRServiceResource;
  evidenceSession: UniRefund_TravellerService_EvidenceSessions_EvidenceSessionDto;
  onPassportScanned: (passportData: string) => void;
}

type ScanStatus = "idle" | "scanning" | "success" | "error";

export default function PassportScanner({languageData, evidenceSession, onPassportScanned}: PassportScannerProps) {
  const [scanStatus, setScanStatus] = useState<ScanStatus>("idle");
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [passportData, setPassportData] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePassportCapture = async (imageBase64: string | null) => {
    if (!imageBase64 || !evidenceSession.id) {
      toast.error(languageData.EvidenceSessionNotAvailable || "Evidence session not available");
      return;
    }

    setIsProcessing(true);
    setScanStatus("scanning");

    try {
      // Remove base64 prefix before sending to API
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

      const response = await postApiTravellerServiceEvidenceSessionPublicAnalyzeDocumentByMrz({
        requestBody: {
          evidenceSessionId: evidenceSession.id,
          documentImageBase64: base64Data,
        },
      });

      if (response.type === "success") {
        // Check for face detection
        const faceDetection = await detectFace(imageBase64);
        if (faceDetection < 80) {
          toast.error(languageData["Toast.Face.NotDetected"].replace("{0}", `${faceDetection}%`));
          setScanStatus("error");
          setIsProcessing(false);
          return;
        }

        setScanStatus("success");
        setPassportData(imageBase64);
        toast.success(languageData.PassportCaptured);
        setShowCameraModal(false);
        setIsProcessing(false);
      } else {
        setScanStatus("error");
        setIsProcessing(false);
        toast.error(languageData.FailedToAnalyzePassport);
      }
    } catch (error) {
      setScanStatus("error");
      setIsProcessing(false);
      toast.error(languageData.ErrorProcessingPassport + String(error));
    }
  };

  const handleOpenCamera = () => {
    setShowCameraModal(true);
    setScanStatus("idle");
  };

  const handleContinue = () => {
    if (passportData) {
      onPassportScanned(passportData);
    }
  };

  const handleRetry = () => {
    setScanStatus("idle");
    setPassportData(null);
    setIsProcessing(false);
    setShowCameraModal(true);
  };

  if (showOnboarding) {
    return (
      <div className="flex h-full flex-col space-y-6">
        {/* Main content area with improved layout */}
        <div className="flex flex-1 flex-col items-center gap-6 md:flex-row">
          {/* Left side - Instructions */}
          <div className="w-full flex-1 space-y-4">
            <div className="space-y-3 text-xs text-gray-600">
              <div className="mb-2 text-base font-semibold text-gray-800">
                {languageData.HowToTakeGoodPassportPhoto || "How to Take a Good Passport Photo"}
              </div>

              <div className="space-y-3">
                <p className="leading-relaxed text-gray-700">- {languageData.PassportTip1}</p>
                <p className="leading-relaxed text-gray-700">- {languageData.PassportTip2}</p>
                <p className="leading-relaxed text-gray-700">- {languageData.PassportTip3}</p>
              </div>
            </div>
            {/* Bottom button */}
            <Button
              className="h-7 w-full bg-red-600 hover:bg-red-700 md:w-4/5"
              onClick={() => {
                setShowOnboarding(false);
              }}>
              {languageData.Continue}
            </Button>
          </div>

          {/* Right side - Passport example - Much larger */}
          <div className="flex w-full flex-1 items-center justify-center md:w-auto">
            <Image
              alt="Passport example"
              className="h-auto w-full max-w-full rounded-lg border shadow-sm md:max-w-[360px]"
              height={160}
              src={PassportMRZ}
              width={240}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Passport Scan Section */}
        {scanStatus === "idle" && !passportData && (
          <div className="space-y-4 text-center">
            <div className="flex flex-col items-center space-y-4">
              <Button className="w-full max-w-xs" onClick={handleOpenCamera} size="lg">
                {languageData.ScanPassport}
              </Button>
            </div>
          </div>
        )}

        {/* Processing State */}
        {scanStatus === "scanning" && (
          <Alert className="border-blue-200 bg-blue-50">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">{languageData["Document.Processing"]}</AlertTitle>
            <AlertDescription className="text-blue-700">
              {languageData["LivenessDetection.Processing"]}
            </AlertDescription>
          </Alert>
        )}

        {/* Success State */}
        {scanStatus === "success" && passportData ? (
          <div className="space-y-4">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">{languageData["Document.Captured"]}</AlertTitle>
              <AlertDescription className="text-green-700">{languageData.PassportCaptured}</AlertDescription>
            </Alert>

            <div className="flex gap-3">
              <Button className="flex-1" onClick={handleContinue}>
                {languageData.Continue}
              </Button>
            </div>
          </div>
        ) : null}

        {/* Error State */}
        {scanStatus === "error" && (
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{languageData.ScanFailed}</AlertTitle>
              <AlertDescription>{languageData.UnableToProcessPassport}</AlertDescription>
            </Alert>

            <Button className="w-full" onClick={handleRetry}>
              {languageData.TryAgain}
            </Button>
          </div>
        )}
      </div>

      {/* Camera Modal */}
      <Dialog onOpenChange={setShowCameraModal} open={showCameraModal}>
        <DialogContent className="h-auto max-w-xl p-2">
          <DialogHeader className="p-2 pb-1">
            <div className="flex items-center justify-center gap-2">
              <Camera className="h-5 w-5" />
              {languageData.ScanPassport}
            </div>
          </DialogHeader>

          <WebcamCapture
            handleImage={(imageBase64: string | null) => {
              void handlePassportCapture(imageBase64);
            }}
            languageData={languageData}
            placeholder={
              <div className="bg-primary/5 relative flex h-full w-full  rounded-lg opacity-70">
                {isProcessing ? (
                  <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-black backdrop-blur-md">
                    <div className="flex flex-col items-center space-y-6 text-white">
                      {/* Large modern spinner */}
                      <div className="relative h-24 w-24">
                        <div className="absolute inset-0 rounded-full border-4 border-gray-800" />
                        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-red-600" />
                        <div
                          className="border-3 absolute inset-2 animate-spin rounded-full border-transparent border-t-white"
                          style={{animationDelay: "150ms", animationDirection: "reverse"}}
                        />
                      </div>

                      {/* Simple bold text */}
                      <div className="space-y-3 text-center">
                        <p className="text-xl font-bold text-white">{languageData["Document.Processing"]}</p>
                        <div className="flex justify-center space-x-2">
                          <div
                            className="h-3 w-3 animate-bounce rounded-full bg-red-600"
                            style={{animationDelay: "0ms"}}
                          />
                          <div
                            className="h-3 w-3 animate-bounce rounded-full bg-white"
                            style={{animationDelay: "200ms"}}
                          />
                          <div
                            className="h-3 w-3 animate-bounce rounded-full bg-red-600"
                            style={{animationDelay: "400ms"}}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-full w-full flex-col justify-center p-2 text-center">
                    <div className="border-primary mx-auto mb-3 flex h-44 w-full max-w-full items-center justify-center rounded-lg border-4 border-dashed md:h-64">
                      <Camera className="text-primary h-6 w-6" />
                    </div>
                    <p className="text-sm font-medium text-gray-700">{languageData.PositionDocumentWithinMarkers}</p>
                  </div>
                </div>
              </div>
            }
            type="document"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
