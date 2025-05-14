"use client";
import {Button} from "@/components/ui/button";
import {toast} from "@/components/ui/sonner";
import type {Block} from "@aws-sdk/client-textract";
import {parse} from "mrz";
import {useState} from "react";
import Image from "next/image";
import type {SSRServiceResource} from "@/language-data/unirefund/SSRService";
import IDCardMRZ from "public/ID-Back.png";
import PassportMRZ from "public/Passport.png";
import IdCardFront from "public/ID-Front.png";
import {detectFace, textractIt} from "../actions";
import type {DocumentData} from "../validation-steps";
import {WebcamCapture} from "../webcam";
import {CheckCircle, AlertCircle} from "lucide-react";

export default function ScanDocument({
  languageData,
  type,
  setCanGoNext,
  front,
  setFront,
  back,
  setBack,
}: {
  languageData: SSRServiceResource;
  type: "passport" | "id-card-front" | "id-card-back";
  setCanGoNext: (value: boolean) => void;
  front: DocumentData;
  setFront: (value: DocumentData) => void;
  back: DocumentData;
  setBack: (value: DocumentData) => void;
}) {
  const [scanStatus, setScanStatus] = useState<"idle" | "scanning" | "success" | "error">("idle");
  const [showOnboarding, setShowOnboarding] = useState(true);

  const renderPassport = () => {
    return (
      <div className="mx-auto w-full md:h-auto">
        <div className="mb-5 rounded-xl border border-gray-100 bg-white p-6 shadow-md">
          <h2 className="mb-2 text-xl font-bold text-gray-900">
            {languageData.PassportOnboardingTitle || "Scan Passport"}
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-gray-600">
            {languageData.PassportOnboardingDescription || "Please position your passport correctly within the frame"}
          </p>

          <div className="mb-6 space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="mt-0.5 h-2 w-2 rounded-full bg-gray-400"></div>
              <p>{languageData.PassportTip1 || "Make sure all text is clearly visible"}</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-0.5 h-2 w-2 rounded-full bg-gray-400"></div>
              <p>{languageData.PassportTip2 || "Position inside the frame completely"}</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-0.5 h-2 w-2 rounded-full bg-gray-400"></div>
              <p>{languageData.PassportTip3 || "Avoid glare and shadows"}</p>
            </div>
          </div>

          {/* Passport mockup image */}
          <div className="mb-4 rounded-lg border border-gray-200 p-4">
            <Image
              src={PassportMRZ}
              width={300}
              height={400}
              alt="Passport mockup"
              className="mx-auto h-auto max-w-full"
            />
          </div>

          <Button
            onClick={() => {
              setShowOnboarding(false);
            }}
            className="bg-primary text-primary-foreground w-full">
            {languageData.Continue}
          </Button>
        </div>
      </div>
    );
  };

  const renderIDCardFront = () => {
    return (
      <div className="mx-auto w-full">
        <div className="mb-5 md:p-6">
          <p className="mb-4 text-sm leading-relaxed text-gray-600">
            {languageData.IDCardFrontOnboardingDescription ||
              "Please position the front side of your ID card within the frame"}
          </p>

          <div className="mb-4 space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="mt-0.5 h-2 w-2 rounded-full bg-gray-400"></div>
              <p>{languageData.IDCardFrontTip1 || "Make sure all text is clearly visible"}</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-0.5 h-2 w-2 rounded-full bg-gray-400"></div>
              <p>{languageData.IDCardFrontTip2 || "Position inside the frame completely"}</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-0.5 h-2 w-2 rounded-full bg-gray-400"></div>
              <p>{languageData.IDCardFrontTip3 || "Avoid glare and shadows"}</p>
            </div>
          </div>

          {/* ID Card mockup image */}
          <div className="mb-4 rounded-lg border border-gray-200">
            <Image
              src={IdCardFront}
              width={500}
              height={300}
              alt="ID Card front mockup"
              className="mx-auto h-auto max-w-full"
            />
          </div>

          <Button
            onClick={() => {
              setShowOnboarding(false);
            }}
            className="bg-primary text-primary-foreground w-full">
            {languageData.Continue}
          </Button>
        </div>
      </div>
    );
  };

  const renderIDCardBack = () => {
    return (
      <div className="mx-auto w-full max-w-md">
        <div className="mb-5 rounded-xl">
          <p className="mb-4 text-sm leading-relaxed text-gray-600">
            {languageData.IDCardBackOnboardingDescription ||
              "Please position the back side of your ID card within the frame"}
          </p>

          <div className="mb-6 space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="mt-0.5 h-2 w-2 rounded-full bg-gray-400"></div>
              <p>{languageData.IDCardBackTip1 || "Make sure MRZ area is fully visible"}</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-0.5 h-2 w-2 rounded-full bg-gray-400"></div>
              <p>{languageData.IDCardBackTip2 || "Position inside the frame completely"}</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-0.5 h-2 w-2 rounded-full bg-gray-400"></div>
              <p>{languageData.IDCardBackTip3 || "Avoid glare and shadows"}</p>
            </div>
          </div>

          {/* ID Card back mockup image */}
          <div className="mb-4 rounded-lg border border-gray-200">
            <Image
              src={IDCardMRZ}
              width={500}
              height={300}
              alt="ID Card back mockup"
              className="mx-auto h-auto max-w-full"
            />
          </div>

          <Button
            onClick={() => {
              setShowOnboarding(false);
            }}
            className="bg-primary text-primary-foreground w-full">
            {languageData.Continue}
          </Button>
        </div>
      </div>
    );
  };

  if (showOnboarding) {
    if (type === "passport") {
      return renderPassport();
    } else if (type === "id-card-front") {
      return renderIDCardFront();
    } else {
      return renderIDCardBack();
    }
  }

  if (type === "passport") {
    return (
      <div className="mx-auto max-w-md space-y-6 md:pb-12">
        <div className="overflow-hidden rounded-xl border-black/10 shadow-sm md:border">
          <div className="md:bg-primary/10 border-b p-5">
            <h3 className="mb-2 text-xl font-semibold text-black">{languageData.ScanPassport || "Scan Passport"}</h3>
            <p className="text-sm text-black/70">
              {languageData.ScanDocumentDescription || "Position your passport properly in the frame"}
            </p>
          </div>

          <div className="bg-white md:p-5">
            <WebcamCapture
              capturedImage={front?.base64}
              handleImage={(imageSrc) => {
                if (!imageSrc) return;
                setScanStatus("scanning");
                void textractIt(imageSrc).then((res) => {
                  if (res?.Blocks) {
                    const mrz = getMRZ(res.Blocks);
                    try {
                      const parsedMRZ = parse(mrz);
                      if (parsedMRZ.format === "TD3") {
                        setFront({
                          base64: imageSrc,
                          data: parsedMRZ.fields,
                        });
                        toast.success(languageData["Toast.MRZ.Detected"] || "MRZ detected successfully.");
                        setScanStatus("success");
                        setCanGoNext(true);
                      } else {
                        toast.error(languageData["Toast.MRZ.InvalidFormat"] || "Invalid MRZ format.");
                        setFront(null);
                        setScanStatus("error");
                        setCanGoNext(false);
                      }

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
                    } catch {
                      toast.error(languageData["Toast.MRZ.Error"] || "An error occurred while parsing MRZ.");
                      setFront(null);
                      setScanStatus("error");
                      setCanGoNext(false);
                    }
                  } else {
                    setScanStatus("error");
                    setCanGoNext(false);
                  }
                });
              }}
              languageData={languageData}
              placeholder={
                <div className="bg-primary/5 relative flex size-full rounded-lg opacity-70">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full p-2 text-center md:p-4">
                      <div className="border-primary my-auto mb-2 flex h-48 w-full items-center justify-center rounded-lg border-2 border-dashed md:h-64"></div>
                      <p className="text-sm text-white">
                        {languageData.PositionDocumentWithinMarkers || "Align your passport with the frame"}
                      </p>
                    </div>
                  </div>
                </div>
              }
              type="document"
            />
          </div>
        </div>

        {scanStatus === "scanning" && (
          <div className="bg-primary/10 flex items-center justify-center rounded-lg p-4 text-black">
            <AlertCircle className="mr-2 h-5 w-5" />
            <p className="text-sm">{languageData["LivenessDetection.Processing"] || "Processing your document..."}</p>
          </div>
        )}

        {front ? (
          <div className="animate-in fade-in-50 mt-6 duration-300">
            <DisplayCaptured document={front} title={languageData.PassportCaptured || "Passport captured"} />
          </div>
        ) : null}
      </div>
    );
  } else if (type === "id-card-front") {
    return (
      <div className="mx-auto max-w-md space-y-4 md:pb-12">
        <div className="overflow-hidden rounded-xl border-black/10 shadow-sm md:border">
          <div className="bg-white md:p-5">
            <WebcamCapture
              capturedImage={front?.base64}
              handleImage={(imageSrc) => {
                if (!imageSrc) return;
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
                    toast.error(
                      (languageData["Toast.Face.NotDetected"] || "Face not detected: {0}").replace("{0}", `${res}%`),
                    );
                    setFront(null);
                    setScanStatus("error");
                    setCanGoNext(false);
                  }
                });
              }}
              languageData={languageData}
              placeholder={
                <div className="bg-primary/5 relative flex size-full rounded-lg opacity-70">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full p-2 text-center md:p-4">
                      <div className="border-primary my-auto mb-2 flex h-48 w-full items-center justify-center rounded-lg border-2 border-dashed md:h-64"></div>
                      <p className="text-sm text-white">
                        {languageData.CaptureIDCardFront || "Position the front of your ID card"}
                      </p>
                    </div>
                  </div>
                </div>
              }
              type="document"
            />
          </div>
        </div>

        {scanStatus === "scanning" && (
          <div className="bg-primary/10 flex items-center justify-center rounded-lg p-4 text-black">
            <AlertCircle className="mr-2 h-5 w-5" />
            <p className="text-sm">{languageData["LivenessDetection.Processing"] || "Processing your document..."}</p>
          </div>
        )}

        {front ? (
          <div className="flex items-center justify-center rounded-lg bg-green-400/30 p-2 text-black">
            <CheckCircle className="mr-2 h-5 w-5" />
            <p className="text-sm"> {languageData.FrontSideCaptured || "Front side captured"}</p>
          </div>
        ) : null}
      </div>
    );
  } else {
    return (
      <div className="mx-auto max-w-md space-y-4 md:pb-12">
        <div className="overflow-hidden">
          <div className="bg-white md:p-5">
            <WebcamCapture
              capturedImage={back?.base64}
              handleImage={(imageSrc) => {
                if (!imageSrc) return;
                setScanStatus("scanning");
                void textractIt(imageSrc).then((res) => {
                  if (res?.Blocks) {
                    const mrz = getMRZ(res.Blocks);
                    try {
                      const parsedMRZ = parse(mrz);
                      if (parsedMRZ.format !== "TD3" && parsedMRZ.format !== "SWISS_DRIVING_LICENSE") {
                        setBack({
                          base64: imageSrc,
                          data: parsedMRZ.fields,
                        });
                        setScanStatus("success");
                        setCanGoNext(true);
                      } else {
                        toast.error(languageData["Toast.MRZ.InvalidFormat"] || "Invalid MRZ format.");
                        setBack({
                          base64: imageSrc,
                          data: null,
                        });
                        setScanStatus("error");
                        setCanGoNext(false);
                      }
                    } catch (e) {
                      toast.error(languageData["Toast.MRZ.Error"] || "An error occurred while parsing MRZ.");
                      setBack({
                        base64: imageSrc,
                        data: null,
                      });
                      setCanGoNext(false);
                      setScanStatus("error");
                    }
                  } else {
                    setBack({
                      base64: imageSrc,
                      data: null,
                    });
                    setScanStatus("error");
                    setCanGoNext(false);
                  }
                });
              }}
              languageData={languageData}
              placeholder={
                <div className="bg-primary/5 relative flex size-full rounded-lg opacity-70">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full p-2 text-center md:p-4">
                      <div className="border-primary my-auto mb-2 flex h-48 w-full items-center justify-center rounded-lg border-2 border-dashed md:h-64"></div>
                      <p className="text-sm text-white">
                        {languageData.CaptureIDCardBack || "Position the back of your ID card"}
                      </p>
                    </div>
                  </div>
                </div>
              }
              type="document"
            />
          </div>
        </div>

        {scanStatus === "scanning" && (
          <div className="bg-primary/10 flex items-center justify-center rounded-lg p-4 text-black">
            <AlertCircle className="mr-2 h-5 w-5" />
            <p className="text-sm">{languageData["LivenessDetection.Processing"] || "Processing your document..."}</p>
          </div>
        )}

        {back?.data ? (
          <div className="flex items-center justify-center rounded-lg bg-green-400/30 p-2 text-black">
            <CheckCircle className="mr-2 h-5 w-5" />
            <p className="text-sm">{languageData.BackSideCaptured || "Back side captured"}</p>
          </div>
        ) : null}
      </div>
    );
  }

}

function getMRZ(blocks: Block[]): string[] {
  return blocks
    .filter((x) => x.BlockType === "WORD" && typeof x.Text === "string" && x.Text.includes("<"))
    .map((y) => y.Text)
    .filter((text): text is string => text !== undefined);
}

function DisplayCaptured({document, title}: {document: DocumentData; title: string}) {
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
                {document.base64 && (
                  <img src={document.base64} alt="Captured document" className="h-full w-full object-cover" />
                )}
              </div>

              {document.data ? (
                <div className="rounded-lg border border-black/10 bg-white/95 p-4 shadow-sm">
                  <div className="mb-2 text-xs font-medium text-black/60">Machine Readable Zone (MRZ)</div>
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
