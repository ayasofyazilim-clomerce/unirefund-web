"use client";
import {toast} from "@/components/ui/sonner";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {useState} from "react";
import {detectFace} from "@repo/actions/unirefund/AWSService/actions";
import {CheckCircle, AlertCircle} from "lucide-react";
import type {SSRServiceResource} from "@/language-data/unirefund/SSRService";
import IDCardMRZ from "public/ID-Back.png";
import PassportMRZ from "public/Passport.png";
import IdCardFront from "public/ID-Front.png";
import type {DocumentData} from "../validation-steps";
import {WebcamCapture} from "../webcam";
import DocumentOnboarding from "./_components/document-onboarding";
import {postApiTravellerServiceEvidenceSessionAnalyzeDocumentByMrz} from "@repo/actions/unirefund/TravellerService/post-actions";

type DocumentType = "passport" | "id-card-front" | "id-card-back";

// Document configuration based on document type
const DocumentConfig = {
  passport: {
    image: PassportMRZ,
    tips: (languageData: SSRServiceResource) => [
      languageData.PassportTip1 || "Make sure all text is clearly visible",
      languageData.PassportTip2 || "Position inside the frame completely",
      languageData.PassportTip3 || "Avoid glare and shadows",
    ],
    title: (languageData: SSRServiceResource) => languageData.PassportOnboardingTitle || "Scan Passport",
    placeholder: (languageData: SSRServiceResource) =>
      languageData.PositionDocumentWithinMarkers || "Align your passport with the frame",
    successMessage: (languageData: SSRServiceResource) => languageData.PassportCaptured || "Passport captured",
  },
  "id-card-front": {
    image: IdCardFront,
    tips: (languageData: SSRServiceResource) => [
      languageData.IDCardFrontTip1 || "Make sure all text is clearly visible",
      languageData.IDCardFrontTip2 || "Position inside the frame completely",
      languageData.IDCardFrontTip3 || "Avoid glare and shadows",
    ],
    title: (languageData: SSRServiceResource) => languageData.IDCardFrontOnboardingTitle || "Scan ID Card Front",
    placeholder: (languageData: SSRServiceResource) =>
      languageData.CaptureIDCardFront || "Position the front of your ID card",
    successMessage: (languageData: SSRServiceResource) => languageData.FrontSideCaptured || "Front side captured",
  },
  "id-card-back": {
    image: IDCardMRZ,
    tips: (languageData: SSRServiceResource) => [
      languageData.IDCardBackTip1 || "Make sure MRZ area is fully visible",
      languageData.IDCardBackTip2 || "Position inside the frame completely",
      languageData.IDCardBackTip3 || "Avoid glare and shadows",
    ],
    title: (languageData: SSRServiceResource) => languageData.IDCardBackOnboardingTitle || "Scan ID Card Back",
    placeholder: (languageData: SSRServiceResource) =>
      languageData.CaptureIDCardBack || "Position the back of your ID card",
    successMessage: (languageData: SSRServiceResource) => languageData.BackSideCaptured || "Back side captured",
  },
};

// Scanner status alert component
function ScannerStatusAlert({
  scanStatus,
  documentData,
  languageData,
  successMessage,
}: {
  scanStatus: string;
  documentData: DocumentData;
  languageData: SSRServiceResource;
  successMessage: string;
}) {
  return (
    <>
      {scanStatus === "scanning" && (
        <Alert className="mt-4" variant="default">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{languageData["Document.Processing"] || "Processing"}</AlertTitle>
          <AlertDescription>
            {languageData["LivenessDetection.Processing"] || "Processing your document..."}
          </AlertDescription>
        </Alert>
      )}

      {scanStatus === "success" && documentData ? (
        <Alert className="mt-4" variant="default">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>{languageData["Document.Captured"] || "Document Captured"}</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      ) : null}
    </>
  );
}

export default function ScanDocument({
  languageData,
  type,
  setCanGoNext,
  front,
  setFront,
  back,
  setBack,
  session,
}: {
  languageData: SSRServiceResource;
  type: DocumentType;
  setCanGoNext: (value: boolean) => void;
  front: DocumentData;
  setFront: (value: DocumentData) => void;
  back: DocumentData;
  setBack: (value: DocumentData) => void;
  session: string;
}) {
  const [scanStatus, setScanStatus] = useState<"idle" | "scanning" | "success" | "error">("idle");
  const [showOnboarding, setShowOnboarding] = useState(true);
  const config = DocumentConfig[type];

  // Render document onboarding screen
  if (showOnboarding) {
    return (
      <DocumentOnboarding
        imageSrc={config.image}
        languageData={languageData}
        onContinue={() => {
          setShowOnboarding(false);
        }}
        tips={config.tips(languageData)}
        title={config.title(languageData)}
        type={type}
      />
    );
  }

  // Create document scanning placeholder UI
  const renderPlaceholder = (placeholderText: string) => (
    <div className="bg-primary/5 relative flex size-full rounded-lg opacity-70">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full p-2 text-center md:p-4">
          <div className="border-primary my-auto mb-2 flex h-48 w-full items-center justify-center rounded-lg border-2 border-dashed md:h-64" />
          <p className="text-sm text-white">{placeholderText}</p>
        </div>
      </div>
    </div>
  );

  // Process passport image
  const handlePassportImage = (imageSrc: string) => {
    setScanStatus("scanning");
    const base64Data = imageSrc.replace(/^data:image\/\w+;base64,/, "");

    void postApiTravellerServiceEvidenceSessionAnalyzeDocumentByMrz({
      requestBody: {
        evidenceSessionId: session,
        documentImageBase64: base64Data,
      },
    })
      .then((res) => {
        if (res.type === "success") {
          setFront({
            base64: imageSrc,
            data: res.data,
          });
          toast.success(languageData["Toast.MRZ.Detected"] || "MRZ detected successfully.");
          setScanStatus("success");
          setCanGoNext(true);

          // Yüz tespiti
          void detectFace(imageSrc).then((faceDetection) => {
            if (faceDetection < 80) {
              toast.error(
                (languageData["Toast.Face.NotDetected"] || "Face not detected: {0}").replace(
                  "{0}",
                  `${faceDetection}%`,
                ),
              );
              setFront(null);
              setScanStatus("error");
              setCanGoNext(false);
            }
          });
        } else {
          toast.error(languageData["Toast.MRZ.Error"] || "An error occurred while analyzing MRZ.");

          setScanStatus("error");
          setCanGoNext(false);
        }
      })
      .catch(() => {
        toast.error(languageData["Toast.MRZ.Error"] || "An error occurred while analyzing MRZ.");
        setFront(null);
        setScanStatus("error");
        setCanGoNext(false);
      });
  };

  // Process ID card front image
  const handleIDCardFrontImage = (imageSrc: string) => {
    setScanStatus("scanning");
    void detectFace(imageSrc).then((res) => {
      if (res > 80) {
        setFront({
          base64: imageSrc,
          data: null,
        });
        setScanStatus("success");
        setCanGoNext(true);
      } else {
        toast.error((languageData["Toast.Face.NotDetected"] || "Face not detected: {0}").replace("{0}", `${res}%`));
        setFront(null);
        setScanStatus("error");
        setCanGoNext(false);
      }
    });
  };

  // Process ID card back image
  const handleIDCardBackImage = (imageSrc: string) => {
    setScanStatus("scanning");
    const base64Data = imageSrc.replace(/^data:image\/\w+;base64,/, "");

    void postApiTravellerServiceEvidenceSessionAnalyzeDocumentByMrz({
      requestBody: {
        evidenceSessionId: session,
        documentImageBase64: base64Data,
      },
    })
      .then((res) => {
        if (res.type === "success") {
          setBack({
            base64: imageSrc,
            data: res.data,
          });
          toast.success(languageData["Toast.MRZ.Detected"] || "MRZ detected successfully.");
          setScanStatus("success");
          setCanGoNext(true);
        } else {
          toast.error(languageData["Toast.MRZ.Error"] || "An error occurred while analyzing MRZ.");

          setScanStatus("error");
          setCanGoNext(false);
        }
      })
      .catch(() => {
        toast.error(languageData["Toast.MRZ.Error"] || "An error occurred while analyzing MRZ.");
        setBack(null);
        setScanStatus("error");
        setCanGoNext(false);
      });
  };

  // Get the appropriate image handler based on document type
  const getImageHandler = () => {
    switch (type) {
      case "passport":
        return handlePassportImage;
      case "id-card-front":
        return handleIDCardFrontImage;
      case "id-card-back":
        return handleIDCardBackImage;
      default:
        return () => {
          setScanStatus("error");
          setCanGoNext(false);
        };
    }
  };

  // Get the appropriate document data based on document type
  const getCurrentDocumentData = () => {
    return type === "id-card-back" ? back : front;
  };

  // Main document scanner UI
  return (
    <div className="mx-auto max-w-md space-y-4 md:pb-12">
      <div
        className={`overflow-hidden ${type !== "id-card-back" ? "rounded-xl border-black/10 shadow-sm md:border" : ""}`}>
        <div className="bg-white md:p-5">
          <WebcamCapture
            allowCameraSwitch
            capturedImage={getCurrentDocumentData()?.base64}
            handleImage={(imageSrc) => {
              if (!imageSrc) return;
              getImageHandler()(imageSrc);
            }}
            languageData={languageData}
            placeholder={renderPlaceholder(config.placeholder(languageData))}
            type="document"
          />
        </div>
      </div>

      <ScannerStatusAlert
        documentData={getCurrentDocumentData()}
        languageData={languageData}
        scanStatus={scanStatus}
        successMessage={config.successMessage(languageData)}
      />
    </div>
  );
}

export function DisplayCaptured({
  document,
  title,
  languageData,
}: {
  document: DocumentData;
  title: string;
  languageData: SSRServiceResource;
}) {
  return (
    <>
      {document ? (
        <div className="overflow-hidden rounded-xl border border-black/10 shadow-sm">
          <div className="bg-primary/10 flex items-center border-b px-5 py-4">
            <CheckCircle className="text-primary mr-2 h-5 w-5" />
            <h4 className="text-sm font-medium text-black">{title}</h4>
          </div>

          <div className="bg-white md:p-5">
            <div className="relative">
              <div className="mb-4 aspect-[3/2] overflow-hidden rounded-lg bg-black/5">
                {document.base64 ? (
                  <img alt="Captured document" className="h-full w-full object-cover" src={document.base64} />
                ) : null}
              </div>

              {document.data ? (
                <div className="rounded-lg border border-black/10 bg-white/95 p-4 shadow-sm">
                  <div className="mb-2 text-xs font-medium text-black/60">{languageData.MachineReadableZone}</div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {Object.keys(document.data).map((key) => {
                      if (!document.data) {
                        return null;
                      }
                      return (
                        <div className="overflow-hidden" key={key}>
                          <span className="block text-black/60">{key}</span>
                          <span className="font-medium text-black">
                            {document.data[key as keyof typeof document.data]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
