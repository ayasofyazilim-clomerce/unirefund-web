"use client";
import {Button} from "@/components/ui/button";
import {defineStepper} from "@stepperize/react";
import type {ParseResult} from "mrz";
import {useState} from "react";
import type {SSRServiceResource} from "@/language-data/unirefund/SSRService";
import LivenessDedection from "./validation-steps/liveness-dedection";
import ScanDocument from "./validation-steps/scan-document";
import Start from "./validation-steps/start";
import TakeSelfie from "./validation-steps/take-selfie";
import SuccessModal from "./validation-steps/finish";

export const GlobalScopper = defineStepper(
  {id: "start", title: "Start Validation"},
  {id: "scan-document", title: "Scan Document"},
  {id: "take-selfie", title: "Take Selfie"},
  {id: "liveness-dedection", title: "Liveness Detection"},
  {id: "finish", title: "Finish"},
);

export type StepProps = {
  step: {id: string; title: string; description: string};
  languageData: SSRServiceResource;
};

export type DocumentData = {
  base64: string | null;
  data: ParseResult["fields"] | null;
} | null;

export default function ValidationSteps({languageData}: {languageData: SSRServiceResource}) {
  const [canGoNext, setCanGoNext] = useState(false);
  const [front, setFront] = useState<DocumentData>(null);
  const [back, setBack] = useState<DocumentData>(null);

  return (
    <div className="bg-gray-3 flex w-full flex-col gap-2 rounded-md p-3 sm:gap-4">
      <GlobalScopper.Scoped>
        <Steps
          back={back}
          front={front}
          languageData={languageData}
          setBack={setBack}
          setCanGoNext={setCanGoNext}
          setFront={setFront}
        />
        <Actions canGoNext={canGoNext} setBack={setBack} setCanGoNext={setCanGoNext} setFront={setFront} />{" "}
      </GlobalScopper.Scoped>
    </div>
  );
}
function Steps({
  front,
  back,
  setFront,
  setBack,
  languageData,
  setCanGoNext,
}: {
  front: DocumentData;
  back: DocumentData;
  setFront: (value: DocumentData) => void;
  setBack: (value: DocumentData) => void;
  languageData: SSRServiceResource;
  setCanGoNext: (value: boolean) => void;
}) {
  const stepper = GlobalScopper.useStepper();

  return (
    <div className="h-full text-start">
      {!stepper.isFirst && (
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold">{stepper.current.title}</h2>
        </div>
      )}
      {stepper.when("start", () => (
        <Start languageData={languageData} />
      ))}

      {stepper.when("scan-document", () => (
        <ScanDocument
          back={back}
          front={front}
          languageData={languageData}
          setBack={setBack}
          setCanGoNext={setCanGoNext}
          setFront={setFront}
          type={stepper.getMetadata("scan-document")?.type as "passport" | "id-card"}
        />
      ))}

      {stepper.when("take-selfie", () => {
        if (!front?.base64) return null;
        return <TakeSelfie documentSrc={front.base64} setCanGoNext={setCanGoNext} />;
      })}

      {stepper.when("liveness-dedection", () => (
        <LivenessDedection setCanGoNext={setCanGoNext} front={front} />
      ))}
      {stepper.when("finish", () => (
        <SuccessModal
          onRestart={() => {
            stepper.reset();
            setCanGoNext(false);
            setBack(null);
            setFront(null);
          }}
        />
      ))}
    </div>
  );
}

function Actions({
  canGoNext,
  setCanGoNext,
  setFront,
  setBack,
}: {
  canGoNext: boolean;
  setCanGoNext: (value: boolean) => void;
  setFront: (value: DocumentData) => void;
  setBack: (value: DocumentData) => void;
}) {
  const stepper = GlobalScopper.useStepper();
  // const scanDocumentStepper = ScanDocumentStepper.useStepper();

  // const isIdCardScanMode =
  //   stepper.current.id === "scan-document" && stepper.getMetadata("scan-document")?.type === "id-card";

  // const hideGlobalButtons = isIdCardScanMode && scanDocumentStepper.current.id === "front";

  return !stepper.isLast ? (
    <div className="mt-6 grid grid-cols-2 gap-2">
      {!stepper.isFirst && (
        <>
          <Button disabled={stepper.isFirst} onClick={stepper.prev} variant="outline">
            Previous
          </Button>
          <Button
            disabled={!canGoNext}
            onClick={() => {
              stepper.next();
              setCanGoNext(false);
            }}
            variant="outline">
            Next
          </Button>
        </>
      )}
      {stepper.when("start", () => (
        <>
          <Button
            className="col-span-full"
            onClick={() => {
              stepper.goTo("scan-document");
              stepper.setMetadata("scan-document", {
                type: "passport",
              });
            }}>
            Start validation with passport
          </Button>
          <Button
            className="col-span-full"
            onClick={() => {
              stepper.goTo("scan-document");
              stepper.setMetadata("scan-document", {
                type: "id-card",
              });
            }}
            variant="outline">
            Start validation with id card
          </Button>
        </>
      ))}
    </div>
  ) : (
    <div className="mt-6 flex items-center gap-2">
      <Button
        onClick={() => {
          stepper.reset();
          setCanGoNext(false);
          setBack(null);
          setFront(null);
        }}>
        Reset
      </Button>
    </div>
  );
}
