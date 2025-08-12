"use client";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {ScanFace} from "lucide-react";
import {useState} from "react";
import {compareFaces} from "@repo/actions/unirefund/AWSService/actions";
import {Button} from "@/components/ui/button";
import Image from "next/image";
import type {SSRServiceResource} from "@/language-data/unirefund/SSRService";
import Selfie from "public/selfie.png";
import {WebcamCapture} from "../webcam";

export default function TakeSelfie({
  setCanGoNext,
  documentSrc,
  languageData,
}: {
  setCanGoNext: (value: boolean) => void;
  documentSrc: string;
  languageData: SSRServiceResource;
}) {
  const [similarity, setSimilarity] = useState(-1);
  const [showOnboarding, setShowOnboarding] = useState(true);

  if (showOnboarding) {
    return (
      <div className="mx-auto w-full max-w-md">
        <div className="mb-6 space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="mt-0.5 h-2 w-2 rounded-full bg-gray-400" />
            <p>{languageData.SelfieTip1}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="mt-0.5 h-2 w-2 rounded-full bg-gray-400" />
            <p>{languageData.SelfieTip2}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="mt-0.5 h-2 w-2 rounded-full bg-gray-400" />
            <p>{languageData.SelfieTip3}</p>
          </div>
        </div>

        {/* Selfie example image */}
        <div className="mb-4 ">
          <Image
            alt="ID Card back mockup"
            className="mx-auto h-auto max-w-full"
            height={100}
            src={Selfie}
            width={200}
          />
        </div>

        <Button
          className="bg-primary text-primary-foreground w-full"
          onClick={() => {
            setShowOnboarding(false);
          }}>
          {languageData.Continue}
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <WebcamCapture
        handleImage={(selfieSrc) => {
          if (!selfieSrc) return;
          void compareFaces(selfieSrc, documentSrc).then((res) => {
            setSimilarity(res);
            if (res > 80) {
              setCanGoNext(true);
            } else {
              setCanGoNext(false);
            }
          });
        }}
        languageData={languageData}
        placeholder={
          <div className="bg-primary/5 relative flex size-full rounded-lg opacity-70">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full p-2 text-center md:p-6">
                <div className="border-primary mx-auto mb-2 flex h-48 w-40 items-center justify-center rounded-full border-4 border-dashed md:h-64 md:w-56" />
                <p className="text-sm font-medium text-white">{languageData.SelfieInstructions}</p>
              </div>
            </div>
          </div>
        }
        type="selfie"
      />

      {similarity !== -1 && (
        <Alert className="mt-4" variant={similarity < 80 ? "destructive" : "default"}>
          <ScanFace className="h-4 w-4" />
          <AlertTitle>{languageData["Face.Similarity"].replace("{0}", similarity.toString())}</AlertTitle>
          <AlertDescription>
            {similarity > 80 ? languageData["Face.Matches"] : languageData["Face.DoesNotMatch"]}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
