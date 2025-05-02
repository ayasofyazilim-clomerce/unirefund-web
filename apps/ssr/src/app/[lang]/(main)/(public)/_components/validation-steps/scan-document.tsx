"use client";
import {Button} from "@/components/ui/button";
import {toast} from "@/components/ui/sonner";
import type {Block} from "@aws-sdk/client-textract";
import {defineStepper} from "@stepperize/react";
import {parse} from "mrz";
import {useEffect, useState} from "react";
import type {SSRServiceResource} from "@/language-data/unirefund/SSRService";
import {textractIt} from "../actions";
import type {DocumentData} from "../validation-steps";
import {GlobalScopper} from "../validation-steps";
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

  // For passport, we only need one image
  if (type === "passport") {
    return (
      <div className="space-y-4">
        <WebcamCapture
          handleImage={(imageSrc) => {
            if (!imageSrc) return;
            void textractIt(imageSrc).then((res) => {
              console.log("MRZ Data:", res);
              if (res?.Blocks) {
                const mrz = getMRZ(res.Blocks);

                try {
                  setFront({
                    base64: imageSrc,
                    data: parse(mrz).fields,
                  });
                  console.log("MRZ Data:", parse(mrz).fields);
                } catch (e) {
                  console.error("Error parsing MRZ data:", e);
                  toast.error("Error parsing MRZ data. Please try again.");
                  setFront(null);
                }
              }
            });
          }}
          type="document"
        />
        {front?.base64 && (
          <div className="mt-4 rounded-md border p-2">
            <p className="mb-2 text-sm font-medium text-green-600">✓ Passport captured</p>
            <div className="relative">
              <img src={front.base64} alt="Passport" className="max-h-40 w-full rounded-md object-contain" />
              {front.data && (
                <div className="mt-2 rounded-lg border border-gray-200 bg-white/60 p-3 backdrop-blur-sm">
                  <div className="mb-2 text-xs font-medium text-gray-500">Machine Readable Zone (MRZ)</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {front.data.documentCode && (
                      <div className="overflow-hidden">
                        <span className="block text-gray-500">Document Code</span>
                        <span className="font-medium">{front.data.documentCode}</span>
                      </div>
                    )}
                    {front.data.issuingState && (
                      <div className="overflow-hidden">
                        <span className="block text-gray-500">Issuing State</span>
                        <span className="font-medium">{front.data.issuingState}</span>
                      </div>
                    )}
                    {front.data.documentNumber && (
                      <div className="overflow-hidden">
                        <span className="block text-gray-500">Document No</span>
                        <span className="font-medium">{front.data.documentNumber}</span>
                      </div>
                    )}
                    {front.data.documentNumberCheckDigit && (
                      <div className="overflow-hidden">
                        <span className="block text-gray-500">Doc No Check Digit</span>
                        <span className="font-medium">{front.data.documentNumberCheckDigit}</span>
                      </div>
                    )}
                    {front.data.optional1 && (
                      <div className="overflow-hidden">
                        <span className="block text-gray-500">Optional 1</span>
                        <span className="font-medium">{front.data.optional1}</span>
                      </div>
                    )}
                    {front.data.birthDate && (
                      <div className="overflow-hidden">
                        <span className="block text-gray-500">Birth Date</span>
                        <span className="font-medium">{front.data.birthDate}</span>
                      </div>
                    )}
                    {front.data.birthDateCheckDigit && (
                      <div className="overflow-hidden">
                        <span className="block text-gray-500">Birth Date Check</span>
                        <span className="font-medium">{front.data.birthDateCheckDigit}</span>
                      </div>
                    )}
                    {front.data.sex && (
                      <div className="overflow-hidden">
                        <span className="block text-gray-500">Sex</span>
                        <span className="font-medium">{front.data.sex}</span>
                      </div>
                    )}
                    {front.data.expirationDate && (
                      <div className="overflow-hidden">
                        <span className="block text-gray-500">Expiry Date</span>
                        <span className="font-medium">{front.data.expirationDate}</span>
                      </div>
                    )}
                    {front.data.expirationDateCheckDigit && (
                      <div className="overflow-hidden">
                        <span className="block text-gray-500">Expiry Date Check</span>
                        <span className="font-medium">{front.data.expirationDateCheckDigit}</span>
                      </div>
                    )}
                    {front.data.nationality && (
                      <div className="overflow-hidden">
                        <span className="block text-gray-500">Nationality</span>
                        <span className="font-medium">{front.data.nationality}</span>
                      </div>
                    )}
                    {front.data.optional2 && (
                      <div className="overflow-hidden">
                        <span className="block text-gray-500">Optional 2</span>
                        <span className="font-medium">{front.data.optional2}</span>
                      </div>
                    )}
                    {front.data.compositeCheckDigit && (
                      <div className="overflow-hidden">
                        <span className="block text-gray-500">Composite Check</span>
                        <span className="font-medium">{front.data.compositeCheckDigit}</span>
                      </div>
                    )}
                    {front.data.lastName && (
                      <div className="overflow-hidden">
                        <span className="block text-gray-500">Surname</span>
                        <span className="font-medium">{front.data.lastName}</span>
                      </div>
                    )}
                    {front.data.firstName && (
                      <div className="overflow-hidden">
                        <span className="block text-gray-500">Given Name</span>
                        <span className="font-medium">{front.data.firstName}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-md font-medium">
          {scanStepper.current.id === "front"
            ? languageData.IDCardFront || "ID Card Front"
            : languageData.IDCardBack || "ID Card Back"}
        </h2>
        <div className="text-muted-foreground text-sm">
          {scanStepper.current.id === "front" ? "Step 1/2" : "Step 2/2"}
        </div>
      </div>

      {scanStepper.when("front", () => (
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">
            {languageData.CaptureIDCardFront || "Please capture the front side of your ID card"}
          </p>
          <WebcamCapture
            handleImage={(imageSrc) => {
              if (!imageSrc) return;
              setFront({
                base64: imageSrc,
                data: null,
              });
            }}
            type="document"
          />
          {front?.base64 && (
            <div className="mt-4 rounded-md border p-2">
              <p className="mb-2 text-sm font-medium text-green-600">✓ Front side captured</p>
              <img src={front.base64} alt="ID Card Front" className="max-h-40 w-full rounded-md object-contain" />
            </div>
          )}
        </div>
      ))}

      {scanStepper.when("back", () => (
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">
            {languageData.CaptureIDCardBack || "Please capture the back side of your ID card"}
          </p>
          <WebcamCapture
            handleImage={(imageSrc) => {
              if (!imageSrc) return;
              void textractIt(imageSrc).then((res) => {
                if (res?.Blocks) {
                  const mrz = getMRZ(res.Blocks);
                  try {
                    const fields = parse(mrz).fields;
                    setBack({
                      base64: imageSrc,
                      data: fields,
                    });
                  } catch (e) {
                    toast.error("Error parsing MRZ data. Please try again.");
                    setBack({
                      base64: imageSrc,
                      data: null,
                    });
                  }
                } else {
                  setBack({
                    base64: imageSrc,
                    data: null,
                  });
                }
              });
            }}
            type="document"
          />
          {back?.base64 && (
            <div className="mt-4 rounded-md border p-2">
              <p className="mb-2 text-sm font-medium text-green-600">✓ Back side captured</p>
              <div className="relative">
                <img alt="ID Card Back" className="max-h-40 w-full rounded-md object-contain" src={back.base64} />
                {back.data && (
                  <div className="mt-2 rounded-lg border border-gray-200 bg-white/60 p-3 backdrop-blur-sm">
                    <div className="mb-2 text-xs font-medium text-gray-500">Machine Readable Zone (MRZ)</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {back.data.documentCode && (
                        <div className="overflow-hidden">
                          <span className="block text-gray-500">Document Code</span>
                          <span className="font-medium">{back.data.documentCode}</span>
                        </div>
                      )}
                      {back.data.issuingState && (
                        <div className="overflow-hidden">
                          <span className="block text-gray-500">Issuing State</span>
                          <span className="font-medium">{back.data.issuingState}</span>
                        </div>
                      )}
                      {back.data.documentNumber && (
                        <div className="overflow-hidden">
                          <span className="block text-gray-500">Document No</span>
                          <span className="font-medium">{back.data.documentNumber}</span>
                        </div>
                      )}
                      {back.data.documentNumberCheckDigit && (
                        <div className="overflow-hidden">
                          <span className="block text-gray-500">Doc No Check Digit</span>
                          <span className="font-medium">{back.data.documentNumberCheckDigit}</span>
                        </div>
                      )}
                      {back.data.optional1 && (
                        <div className="overflow-hidden">
                          <span className="block text-gray-500">Optional 1</span>
                          <span className="font-medium">{back.data.optional1}</span>
                        </div>
                      )}
                      {back.data.birthDate && (
                        <div className="overflow-hidden">
                          <span className="block text-gray-500">Birth Date</span>
                          <span className="font-medium">{back.data.birthDate}</span>
                        </div>
                      )}
                      {back.data.birthDateCheckDigit && (
                        <div className="overflow-hidden">
                          <span className="block text-gray-500">Birth Date Check</span>
                          <span className="font-medium">{back.data.birthDateCheckDigit}</span>
                        </div>
                      )}
                      {back.data.sex && (
                        <div className="overflow-hidden">
                          <span className="block text-gray-500">Sex</span>
                          <span className="font-medium">{back.data.sex}</span>
                        </div>
                      )}
                      {back.data.expirationDate && (
                        <div className="overflow-hidden">
                          <span className="block text-gray-500">Expiry Date</span>
                          <span className="font-medium">{back.data.expirationDate}</span>
                        </div>
                      )}
                      {back.data.expirationDateCheckDigit && (
                        <div className="overflow-hidden">
                          <span className="block text-gray-500">Expiry Date Check</span>
                          <span className="font-medium">{back.data.expirationDateCheckDigit}</span>
                        </div>
                      )}
                      {back.data.nationality && (
                        <div className="overflow-hidden">
                          <span className="block text-gray-500">Nationality</span>
                          <span className="font-medium">{back.data.nationality}</span>
                        </div>
                      )}
                      {back.data.optional2 && (
                        <div className="overflow-hidden">
                          <span className="block text-gray-500">Optional 2</span>
                          <span className="font-medium">{back.data.optional2}</span>
                        </div>
                      )}
                      {back.data.compositeCheckDigit && (
                        <div className="overflow-hidden">
                          <span className="block text-gray-500">Composite Check</span>
                          <span className="font-medium">{back.data.compositeCheckDigit}</span>
                        </div>
                      )}
                      {back.data.lastName && (
                        <div className="overflow-hidden">
                          <span className="block text-gray-500">Surname</span>
                          <span className="font-medium">{back.data.lastName}</span>
                        </div>
                      )}
                      {back.data.firstName && (
                        <div className="overflow-hidden">
                          <span className="block text-gray-500">Given Name</span>
                          <span className="font-medium">{back.data.firstName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}

      <div className="mt-8 flex justify-between">
        <Button
          variant="outline"
          onClick={() => {
            if (scanStepper.isFirst) {
              // Do nothing or show info that this is the first step
            } else {
              scanStepper.prev();
            }
          }}
          disabled={scanStepper.isFirst}>
          {languageData.FrontSide || "Previous"}
        </Button>

        <Button
          onClick={() => {
            if (scanStepper.isLast) {
              // Son adımda olduğumuzda, ana adıma geçişe izin ver
              setCanGoNext(true);
              // Doğrudan bir sonraki global adıma geçmek için burada global stepper'ı ilerletmeye çalışabilirsiniz
              // Ancak bu ScanDocument bileşeninin içinde global stepper'a erişimimiz yok
            } else {
              scanStepper.next();
            }
          }}
          disabled={scanStepper.current.id === "front" ? !front : false}>
          {languageData.BackSide || "Next"}
        </Button>
      </div>
    </div>
  );
}

export function ScanDocumentStep({
  languageData,
  setFront,
  setBack,
}: {
  languageData: SSRServiceResource;
  setFront: (value: DocumentData) => void;
  setBack: (value: DocumentData) => void;
}) {
  const globalStepper = GlobalScopper.useStepper();
  const scanStepper = ScanDocumentStepper.useStepper();
  const [localFront, setLocalFront] = useState<DocumentData>(null);
  const [localBack, setLocalBack] = useState<DocumentData>(null);

  useEffect(() => {
    // When front is captured, update the parent state
    if (localFront) {
      setFront(localFront);
    }
  }, [localFront, setFront]);

  useEffect(() => {
    // When back is captured, update the parent state
    if (localBack) {
      setBack(localBack);
    }
  }, [localBack, setBack]);

  return (
    <>
      {globalStepper.when("scan-document", () => (
        <div className="w-full space-y-4">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-md font-medium">
              {scanStepper.current.id === "front"
                ? languageData.IDCardFront || "ID Card Front"
                : languageData.IDCardBack || "ID Card Back"}
            </h2>
            <div className="text-muted-foreground text-sm">
              {scanStepper.current.id === "front" ? "Step 1/2" : "Step 2/2"}
            </div>
          </div>

          {scanStepper.when("front", () => (
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">
                {languageData.CaptureIDCardFront || "Please capture the front side of your ID card"}
              </p>
              <WebcamCapture
                handleImage={(imageSrc) => {
                  if (!imageSrc) return;
                  setLocalFront({
                    base64: imageSrc,
                    data: null,
                  });
                }}
                type="document"
              />
              {localFront?.base64 && (
                <div className="mt-4 rounded-md border p-2">
                  <p className="mb-2 text-sm font-medium text-green-600">✓ Front side captured</p>
                  <img
                    alt="ID Card Front"
                    className="max-h-40 w-full rounded-md object-contain"
                    src={localFront.base64}
                  />
                </div>
              )}

              <div className="mt-8 flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (scanStepper.isFirst) {
                      // Do nothing or show info that this is the first step
                    } else {
                      scanStepper.prev();
                    }
                  }}
                  disabled={scanStepper.isFirst}>
                  {languageData.Previous || "Previous"}
                </Button>
                <Button
                  disabled={!localFront}
                  onClick={() => {
                    scanStepper.next();
                  }}>
                  {languageData.Next || "Next"}
                </Button>
              </div>
            </div>
          ))}

          {scanStepper.when("back", () => (
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">
                {languageData.CaptureIDCardBack || "Please capture the back side of your ID card"}
              </p>
              <WebcamCapture
                handleImage={(imageSrc) => {
                  if (!imageSrc) return;
                  void textractIt(imageSrc).then((res) => {
                    if (res?.Blocks) {
                      const mrz = getMRZ(res.Blocks);
                      try {
                        const fields = parse(mrz).fields;
                        setLocalBack({
                          base64: imageSrc,
                          data: fields,
                        });
                      } catch (e) {
                        toast.error("Error parsing MRZ data. Please try again.");
                        setLocalBack({
                          base64: imageSrc,
                          data: null,
                        });
                      }
                    } else {
                      setLocalBack({
                        base64: imageSrc,
                        data: null,
                      });
                    }
                  });
                }}
                type="document"
              />
              {localBack?.base64 && (
                <div className="mt-4 rounded-md border p-2">
                  <p className="mb-2 text-sm font-medium text-green-600">✓ Back side captured</p>
                  <div className="relative">
                    <img
                      alt="ID Card Back"
                      className="max-h-40 w-full rounded-md object-contain"
                      src={localBack.base64}
                    />
                    {localBack.data && (
                      <div className="mt-2 rounded-lg border border-gray-200 bg-white/60 p-3 backdrop-blur-sm">
                        <div className="mb-2 text-xs font-medium text-gray-500">Machine Readable Zone (MRZ)</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {localBack.data.documentCode && (
                            <div className="overflow-hidden">
                              <span className="block text-gray-500">Document Code</span>
                              <span className="font-medium">{localBack.data.documentCode}</span>
                            </div>
                          )}
                          {localBack.data.issuingState && (
                            <div className="overflow-hidden">
                              <span className="block text-gray-500">Issuing State</span>
                              <span className="font-medium">{localBack.data.issuingState}</span>
                            </div>
                          )}
                          {localBack.data.documentNumber && (
                            <div className="overflow-hidden">
                              <span className="block text-gray-500">Document No</span>
                              <span className="font-medium">{localBack.data.documentNumber}</span>
                            </div>
                          )}
                          {localBack.data.documentNumberCheckDigit && (
                            <div className="overflow-hidden">
                              <span className="block text-gray-500">Doc No Check Digit</span>
                              <span className="font-medium">{localBack.data.documentNumberCheckDigit}</span>
                            </div>
                          )}
                          {localBack.data.optional1 && (
                            <div className="overflow-hidden">
                              <span className="block text-gray-500">Optional 1</span>
                              <span className="font-medium">{localBack.data.optional1}</span>
                            </div>
                          )}
                          {localBack.data.birthDate && (
                            <div className="overflow-hidden">
                              <span className="block text-gray-500">Birth Date</span>
                              <span className="font-medium">{localBack.data.birthDate}</span>
                            </div>
                          )}
                          {localBack.data.birthDateCheckDigit && (
                            <div className="overflow-hidden">
                              <span className="block text-gray-500">Birth Date Check</span>
                              <span className="font-medium">{localBack.data.birthDateCheckDigit}</span>
                            </div>
                          )}
                          {localBack.data.sex && (
                            <div className="overflow-hidden">
                              <span className="block text-gray-500">Sex</span>
                              <span className="font-medium">{localBack.data.sex}</span>
                            </div>
                          )}
                          {localBack.data.expirationDate && (
                            <div className="overflow-hidden">
                              <span className="block text-gray-500">Expiry Date</span>
                              <span className="font-medium">{localBack.data.expirationDate}</span>
                            </div>
                          )}
                          {localBack.data.expirationDateCheckDigit && (
                            <div className="overflow-hidden">
                              <span className="block text-gray-500">Expiry Date Check</span>
                              <span className="font-medium">{localBack.data.expirationDateCheckDigit}</span>
                            </div>
                          )}
                          {localBack.data.nationality && (
                            <div className="overflow-hidden">
                              <span className="block text-gray-500">Nationality</span>
                              <span className="font-medium">{localBack.data.nationality}</span>
                            </div>
                          )}
                          {localBack.data.optional2 && (
                            <div className="overflow-hidden">
                              <span className="block text-gray-500">Optional 2</span>
                              <span className="font-medium">{localBack.data.optional2}</span>
                            </div>
                          )}
                          {localBack.data.compositeCheckDigit && (
                            <div className="overflow-hidden">
                              <span className="block text-gray-500">Composite Check</span>
                              <span className="font-medium">{localBack.data.compositeCheckDigit}</span>
                            </div>
                          )}
                          {localBack.data.lastName && (
                            <div className="overflow-hidden">
                              <span className="block text-gray-500">Surname</span>
                              <span className="font-medium">{localBack.data.lastName}</span>
                            </div>
                          )}
                          {localBack.data.firstName && (
                            <div className="overflow-hidden">
                              <span className="block text-gray-500">Given Name</span>
                              <span className="font-medium">{localBack.data.firstName}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-8 flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    scanStepper.prev();
                  }}>
                  {languageData.Previous || "Previous"}
                </Button>
                <Button
                  onClick={() => {
                    // No condition to hide global buttons
                  }}>
                  {languageData.Next || "Next"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

function getMRZ(blocks: Block[]): string[] {
  return blocks
    .filter((x) => x.BlockType === "WORD" && typeof x.Text === "string" && x.Text.includes("<"))
    .map((y) => y.Text)
    .filter((text): text is string => text !== undefined);
}
