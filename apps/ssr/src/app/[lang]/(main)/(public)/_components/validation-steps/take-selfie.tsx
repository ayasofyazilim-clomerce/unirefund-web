"use client";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {ScanFace} from "lucide-react";
import {useState} from "react";
import {compareFaces} from "../actions";
import {WebcamCapture} from "../webcam";

export default function TakeSelfie({
  setCanGoNext,
  documentSrc,
}: {
  setCanGoNext: (value: boolean) => void;
  documentSrc: string;
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
        type="selfie"
      />

      {similarity !== -1 && (
        <Alert className="mt-4" variant={similarity < 80 ? "destructive" : "default"}>
          <ScanFace className="h-4 w-4" />
          <AlertTitle>Similarity: %{similarity}</AlertTitle>
          <AlertDescription>
            {similarity > 80 ? "Your face matches the document" : "Your face does not match the document"}
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}
