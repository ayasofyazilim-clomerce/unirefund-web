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

export const GlobalScopper = defineStepper(
  {id: "start", title: "Start Validation"},
  {id: "scan-document", title: "Scan Document"},
  {id: "take-selfie", title: "Take Selfie"},
  {id: "liveness-dedection", title: "Liveness Detection"},
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

  return (
    <div className="bg-gray-3 flex flex-col gap-4 rounded-md p-4">
      <GlobalScopper.Scoped>
        <Steps languageData={languageData} setCanGoNext={setCanGoNext} />
        <Actions canGoNext={canGoNext} languageData={languageData} setCanGoNext={setCanGoNext} />
      </GlobalScopper.Scoped>
    </div>
  );
}
function Steps({
  languageData,
  // canGoNext,
  setCanGoNext,
}: {
  languageData: SSRServiceResource;
  // canGoNext: boolean;
  setCanGoNext: (value: boolean) => void;
}) {
  const stepper = GlobalScopper.useStepper();
  const [front, setFront] = useState<DocumentData>(null);
  const [back, setBack] = useState<DocumentData>(null);

  return (
    <div className="h-full text-start">
      {!stepper.isFirst && (
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold">{stepper.current.title}</h2>
          {/* <p className="text-sm text-gray-500">{stepper.current.id}</p> */}
        </div>
      )}
      {stepper.when("start", () => (
        <Start languageData={languageData} />
      ))}

      {stepper.when("scan-document", () => (
        <ScanDocument
          back={back}
          front={front}
          setBack={setBack}
          type={stepper.getMetadata("scan-document")?.type as "passport" | "id-card"}
          languageData={languageData}
          // canGoNext={canGoNext}
          setCanGoNext={setCanGoNext}
          // front={front}
          setFront={setFront}
          // back={back}
          // setBack={setBack}
        />
      ))}

      {stepper.when("take-selfie", () => {
        if (!front?.base64) return null;
        return <TakeSelfie documentSrc={front.base64} languageData={languageData} setCanGoNext={setCanGoNext} />;
      })}

      {stepper.when("liveness-dedection", () => (
        <LivenessDedection languageData={languageData} />
      ))}
    </div>
  );
}

function Actions({
  canGoNext,
  setCanGoNext,
}: {
  languageData: SSRServiceResource;
  canGoNext: boolean;
  setCanGoNext: (value: boolean) => void;
}) {
  const stepper = GlobalScopper.useStepper();
  return !stepper.isLast ? (
    <div className="grid grid-cols-2 gap-2">
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
    <div className="flex items-center gap-2">
      <Button onClick={stepper.reset}>Reset</Button>
    </div>
  );
}
