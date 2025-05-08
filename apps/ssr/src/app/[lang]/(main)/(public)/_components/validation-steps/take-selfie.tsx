"use client";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {ScanFace} from "lucide-react";
import {useState} from "react";
import type {SSRServiceResource} from "@/language-data/unirefund/SSRService";
import {compareFaces} from "../actions";
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
  return (
    <>
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
    </>
  );
}
