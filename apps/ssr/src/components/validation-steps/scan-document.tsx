"use client";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {toast} from "@/components/ui/sonner";
import {detectFace} from "@repo/actions/unirefund/AWSService/actions";
import {postApiTravellerServiceEvidenceSessionPublicAnalyzeDocumentByMrz} from "@repo/actions/unirefund/TravellerService/post-actions";
import {AlertCircle, CheckCircle} from "lucide-react";
import {useState} from "react";
import type {SSRServiceResource} from "@/language-data/unirefund/SSRService";
import IDCardMRZ from "public/ID-Back.png";
import IdCardFront from "public/ID-Front.png";
import PassportMRZ from "public/Passport.png";
import type {DocumentData} from "../validation-steps";
import {WebcamCapture} from "../webcam";
import DocumentOnboarding from "./_components/document-onboarding";

type DocumentType = "passport" | "id-card-front" | "id-card-back";

// Document configuration based on document type
const DocumentConfig = {
  passport: {
    image: PassportMRZ,
    tips: (languageData: SSRServiceResource) => [
      languageData.PassportTip1,
      languageData.PassportTip2,
      languageData.PassportTip3,
    ],
    title: (languageData: SSRServiceResource) => languageData.PassportOnboardingTitle,
    placeholder: (languageData: SSRServiceResource) => languageData.PositionDocumentWithinMarkers,
    successMessage: (languageData: SSRServiceResource) => languageData.PassportCaptured,
  },
  "id-card-front": {
    image: IdCardFront,
    tips: (languageData: SSRServiceResource) => [
      languageData.IDCardFrontTip1,
      languageData.IDCardFrontTip2,
      languageData.IDCardFrontTip3,
    ],
    title: (languageData: SSRServiceResource) => languageData.IDCardFrontOnboardingTitle,
    placeholder: (languageData: SSRServiceResource) => languageData.CaptureIDCardFront,
    successMessage: (languageData: SSRServiceResource) => languageData.FrontSideCaptured,
  },
  "id-card-back": {
    image: IDCardMRZ,
    tips: (languageData: SSRServiceResource) => [
      languageData.IDCardBackTip1,
      languageData.IDCardBackTip2,
      languageData.IDCardBackTip3,
    ],
    title: (languageData: SSRServiceResource) => languageData.IDCardBackOnboardingTitle,
    placeholder: (languageData: SSRServiceResource) => languageData.CaptureIDCardBack,
    successMessage: (languageData: SSRServiceResource) => languageData.BackSideCaptured,
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
          <AlertTitle>{languageData["Document.Processing"]}</AlertTitle>
          <AlertDescription>{languageData["LivenessDetection.Processing"]}</AlertDescription>
        </Alert>
      )}

      {scanStatus === "success" && documentData ? (
        <Alert className="mt-4" variant="default">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>{languageData["Document.Captured"]}</AlertTitle>
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

    void postApiTravellerServiceEvidenceSessionPublicAnalyzeDocumentByMrz({
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
          toast.success(languageData["Toast.MRZ.Detected"]);
          setScanStatus("success");
          setCanGoNext(true);

          // Yüz tespiti
          void detectFace(imageSrc).then((faceDetection) => {
            if (faceDetection < 80) {
              toast.error(languageData["Toast.Face.NotDetected"].replace("{0}", `${faceDetection}%`));
              setFront(null);
              setScanStatus("error");
              setCanGoNext(false);
            }
          });
        } else {
          toast.error(languageData["Toast.MRZ.Error"]);

          setScanStatus("error");
          setCanGoNext(false);
        }
      })
      .catch(() => {
        toast.error(languageData["Toast.MRZ.Error"]);
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
        toast.error(languageData["Toast.Face.NotDetected"].replace("{0}", `${res}%`));
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

    void postApiTravellerServiceEvidenceSessionPublicAnalyzeDocumentByMrz({
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
          toast.success(languageData["Toast.MRZ.Detected"]);
          setScanStatus("success");
          setCanGoNext(true);
        } else {
          toast.error(languageData["Toast.MRZ.Error"]);

          setScanStatus("error");
          setCanGoNext(false);
        }
      })
      .catch(() => {
        toast.error(languageData["Toast.MRZ.Error"]);
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
    <div className="mx-auto max-w-md space-y-4 py-4">
      <div
        className={`overflow-hidden ${type !== "id-card-back" ? "rounded-xl border-black/10 shadow-sm md:border" : ""}`}>
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
