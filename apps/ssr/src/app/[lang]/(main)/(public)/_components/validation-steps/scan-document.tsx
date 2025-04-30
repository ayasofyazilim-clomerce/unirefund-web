"use client";
import {toast} from "@/components/ui/sonner";
import {toastOnSubmit} from "@repo/ui/toast-on-submit";
import {defineStepper} from "@stepperize/react";
import {parse} from "mrz";
import {useEffect} from "react";
import {Button} from "@/components/ui/button";
import type {SSRServiceResource} from "@/language-data/unirefund/SSRService";
import {textractIt} from "../actions";
import type {DocumentData} from "../validation-steps";
import {GlobalScopper} from "../validation-steps";
import {WebcamCapture} from "../webcam";

export default function ScanDocument({
  languageData,
  type,
  // canGoNext,
  setCanGoNext,
  front,
  setFront,
  back,
  setBack,
}: {
  languageData: SSRServiceResource;
  type: "passport" | "id-card";
  // canGoNext: boolean;
  setCanGoNext: (value: boolean) => void;
  front: DocumentData;
  setFront: (value: DocumentData) => void;
  back: DocumentData;
  setBack: (value: DocumentData) => void;
}) {
  useEffect(() => {
    if (type === "id-card") {
      if (front && back) {
        setCanGoNext(true);
      } else {
        setCanGoNext(false);
      }
    } else if (front) {
      setCanGoNext(true);
    } else {
      setCanGoNext(false);
    }
  }, [front, back]);
  if (type === "passport") {
    return (
      <WebcamCapture
        handleImage={(imageSrc) => {
          if (!imageSrc) return;
          void textractIt(imageSrc).then((res) => {
            if (res?.Blocks) {
              const mrz = res.Blocks.filter(
                (x) => x.BlockType === "WORD" && typeof x.Text === "string" && x.Text.includes("<"),
              )
                .map((y) => y.Text)
                .filter((x) => typeof x === "string");
              try {
                const fields = parse(mrz).fields;
                toastOnSubmit(fields);
                setFront({
                  base64: imageSrc,
                  data: parse(mrz).fields,
                });
              } catch (e) {
                toast.error("Error parsing MRZ data. Please try again.");
                setFront(null);
              }
            }
          });
        }}
        languageData={languageData}
        type="document"
      />
    );
  }
  return (
    <div>
      <h3 className="text-sm font-bold">Front</h3>

      <WebcamCapture
        handleImage={(imageSrc) => {
          setFront({
            base64: imageSrc,
            data: null,
          });
        }}
        languageData={languageData}
        type="document"
      />
      <h3 className="text-sm font-bold">Back</h3>
      <WebcamCapture
        handleImage={(imageSrc) => {
          if (!imageSrc) return;
          void textractIt(imageSrc).then((res) => {
            if (res?.Blocks) {
              const mrz = res.Blocks.filter(
                (x) => x.BlockType === "WORD" && typeof x.Text === "string" && x.Text.includes("<"),
              )
                .map((y) => y.Text)
                .filter((x) => typeof x === "string");
              toastOnSubmit(parse(mrz).fields);
              setBack({
                base64: imageSrc,
                data: parse(mrz).fields,
              });
            }
          });
        }}
        languageData={languageData}
        type="document"
      />
    </div>
  );
}

export const ScanDocumentStepper = defineStepper({id: "front", title: "Front"}, {id: "back", title: "Back"});

export function ScanDocumentStep({
  languageData,
  // canGoNext,
  // setCanGoNext,
  // front,
  setFront,
  // back,
  setBack,
}: {
  languageData: SSRServiceResource;
  // canGoNext: boolean;

  // setCanGoNext: (value: boolean) => void;
  // front: DocumentData;
  setFront: (value: DocumentData) => void;
  // back: DocumentData;
  setBack: (value: DocumentData) => void;
}) {
  const globalStepper = GlobalScopper.useStepper();
  const scanStepper = ScanDocumentStepper.useStepper();
  return (
    <>
      {globalStepper.when("scan-document", (gstep) => (
        <div>
          {gstep.id}
          {scanStepper.when("front", (step) => (
            <div>
              {step.id}
              <WebcamCapture
                handleImage={(imageSrc) => {
                  setFront({
                    base64: imageSrc,
                    data: null,
                  });
                }}
                languageData={languageData}
                type="document"
              />
              Front
            </div>
          ))}
          {scanStepper.when("back", (step) => (
            <div>
              {step.id}
              Back
              <WebcamCapture
                handleImage={(imageSrc) => {
                  if (!imageSrc) return;
                  void textractIt(imageSrc).then((res) => {
                    if (res?.Blocks) {
                      const mrz = res.Blocks.filter(
                        (x) => x.BlockType === "WORD" && typeof x.Text === "string" && x.Text.includes("<"),
                      )
                        .map((y) => y.Text)
                        .filter((x) => typeof x === "string");
                      toastOnSubmit(parse(mrz).fields);
                      setBack({
                        base64: imageSrc,
                        data: parse(mrz).fields,
                      });
                    }
                  });
                }}
                languageData={languageData}
                type="document"
              />
            </div>
          ))}

          {globalStepper.getMetadata("scan-document")?.type === "id-card" && <MyLocalActions />}
        </div>
      ))}
    </>
  );
}

function MyLocalActions() {
  const stepper = ScanDocumentStepper.useStepper();
  return (
    <div className="mt-4 flex items-center justify-between">
      <Button
        onClick={() => {
          stepper.goTo("back");
        }}
        variant="outline">
        Front
      </Button>
      <Button
        onClick={() => {
          stepper.goTo("front");
        }}
        variant="outline">
        Back
      </Button>
    </div>
  );
}
