"use client";
import {Button} from "@/components/ui/button";
import {toast} from "@/components/ui/sonner";
import type {Block} from "@aws-sdk/client-textract";
import {defineStepper} from "@stepperize/react";
import {parse} from "mrz";
import {useEffect} from "react";
import Image from "next/image";
import type {SSRServiceResource} from "@/language-data/unirefund/SSRService";
import IDCardMRZ from "public/idcard-mrz.svg";
import PassportMRZ from "public/passport-mrz.svg";
import {detectFace, textractIt} from "../actions";
import type {DocumentData} from "../validation-steps";
import {WebcamCapture} from "../webcam";

export const ScanDocumentStepper = defineStepper({id: "front", title: "Front"}, {id: "back", title: "Back"});

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
  type: "passport" | "id-card";
  setCanGoNext: (value: boolean) => void;
  front: DocumentData;
  setFront: (value: DocumentData) => void;
  back: DocumentData;
  setBack: (value: DocumentData) => void;
}) {
  // Initialize the stepper hook unconditionally to fix the rules-of-hooks error
  const scanStepper = ScanDocumentStepper.useStepper();

  // Always allow to go next regardless of state
  useEffect(() => {
    if (type === "id-card") {
      if (front && back?.data) {
        setCanGoNext(true);
      } else {
        setCanGoNext(false);
      }
    } else if (front) {
      setCanGoNext(true);
    } else {
      setCanGoNext(false);
    }
  }, [front, back, type]);
  if (type === "passport") {
    return (
      <div className="space-y-4">
        <WebcamCapture
          capturedImage={front?.base64}
          handleImage={(imageSrc) => {
            if (!imageSrc) return;
            void textractIt(imageSrc).then((res) => {
              if (res?.Blocks) {
                const mrz = getMRZ(res.Blocks);
                try {
                  const parsedMRZ = parse(mrz);
                  if (parsedMRZ.format === "TD3") {
                    // Pasaport verisi olarak ayarla
                    setFront({
                      base64: imageSrc,
                      data: parsedMRZ.fields,
                    });
                    toast.success(languageData["Toast.MRZ.Detected"]);
                  } else {
                    toast.error(languageData["Toast.MRZ.InvalidFormat"]);
                    setFront(null);
                  }

                  void detectFace(imageSrc).then((faceDetection) => {
                    if (faceDetection > 80) {
                      toast.success(languageData["Toast.Face.Detected"].replace("{0}", String(faceDetection)));
                      // Yüz algılama başarılı ise, zaten MRZ verisini içeren front'u güncellemiyoruz
                      // Böylece MRZ verisi korunuyor
                    } else {
                      toast.error(languageData["Toast.Face.NotDetected"].replace("{0}", String(faceDetection)));
                      setFront(null);
                    }
                  });
                } catch {
                  toast.error(languageData["Toast.MRZ.Error"]);
                  setFront(null);
                }
              }
            });
          }}
          languageData={languageData}
          placeholder={
            <div className="relative flex size-full opacity-50">
              <Image
                alt="Passport MRZ"
                className="!relative mb-4 mt-auto !h-auto !p-4"
                fill
                src={PassportMRZ as string}
              />
            </div>
          }
          type="document"
        />
        {front ? <DisplayCaptured document={front} title={languageData.PassportCaptured} /> : null}
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-md font-medium">
          {scanStepper.current.id === "front"
            ? languageData.IDCardFront || "ID Card Front"
            : languageData.IDCardBack || "ID Card Back"}
        </h2>
        <div className="text-muted-foreground text-sm">
          {scanStepper.current.id === "front"
            ? languageData.Step1of2 || "Step 1/2"
            : languageData.Step2of2 || "Step 2/2"}
        </div>
      </div>

      {scanStepper.when("front", () => (
        <>
          <p className="text-muted-foreground text-sm">
            {languageData.CaptureIDCardFront || "Please capture the front side of your ID card"}
          </p>
          <WebcamCapture
            capturedImage={front?.base64}
            handleImage={(imageSrc) => {
              if (!imageSrc) return;
              void detectFace(imageSrc).then((res) => {
                if (res > 80) {
                  toast.success(languageData["Toast.Face.Detected"].replace("{0}", String(res)));
                  setFront({
                    base64: imageSrc,
                    data: null,
                  });
                } else {
                  toast.error(languageData["Toast.Face.NotDetected"].replace("{0}", String(res)));
                  setFront(null);
                }
              });
            }}
            languageData={languageData}
            type="document"
          />
        </>
      ))}

      {scanStepper.when("back", () => (
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">
            {languageData.CaptureIDCardBack || "Please capture the back side of your ID card"}
          </p>
          <WebcamCapture
            capturedImage={back?.base64}
            handleImage={(imageSrc) => {
              if (!imageSrc) return;
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
                    } else {
                      toast.error(languageData["Toast.MRZ.InvalidFormat"]);
                      setBack({
                        base64: imageSrc,
                        data: null,
                      });
                    }
                  } catch (e) {
                    toast.error(languageData["Toast.MRZ.Error"]);
                    setBack({
                      base64: imageSrc,
                      data: null,
                    });
                    setCanGoNext(false);
                  }
                } else {
                  setBack({
                    base64: imageSrc,
                    data: null,
                  });
                }
              });
            }}
            languageData={languageData}
            placeholder={
              <div className="relative flex size-full opacity-50">
                <Image alt="ID Card MRZ" className="!relative mt-auto !h-auto !p-4" fill src={IDCardMRZ as string} />
              </div>
            }
            type="document"
          />
          {back ? <DisplayCaptured document={back} title={languageData.BackSideCaptured} /> : null}
        </div>
      ))}

      <div className="mt-8 flex justify-between">
        <Button
          disabled={scanStepper.isFirst}
          onClick={() => {
            if (scanStepper.isFirst) {
              // Do nothing or show info that this is the first step
            } else {
              scanStepper.prev();
            }
          }}
          variant="outline">
          {languageData.FrontSide || "Previous"}
        </Button>

        <Button
          disabled={scanStepper.current.id === "front" ? !front : !back?.data}
          onClick={() => {
            if (scanStepper.isLast) {
              // Son adımda olduğumuzda, ana adıma geçişe izin ver
              setCanGoNext(true);
              // Doğrudan bir sonraki global adıma geçmek için burada global stepper'ı ilerletmeye çalışabilirsiniz
              // Ancak bu ScanDocument bileşeninin içinde global stepper'a erişimimiz yok
            } else {
              scanStepper.next();
            }
          }}>
          {languageData.BackSide || "Next"}
        </Button>
      </div>
    </div>
  );
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
        <div className="mt-4 rounded-md border p-2">
          <p className="mb-2 text-sm font-medium text-green-600">{title}</p>
          <div className="relative">
            {document.data ? (
              <div className="mt-2 rounded-lg border border-gray-200 bg-white/60 p-3 backdrop-blur-sm">
                <div className="mb-2 text-xs font-medium text-gray-500">Machine Readable Zone (MRZ)</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.keys(document.data).map((key) => {
                    if (!document.data) {
                      return null;
                    }
                    return (
                      <div className="overflow-hidden" key={key}>
                        <span className="block text-gray-500">{key}</span>
                        <span className="font-medium">{document.data[key as keyof typeof document.data]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
