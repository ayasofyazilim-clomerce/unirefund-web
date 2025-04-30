"use client";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import {Camera} from "lucide-react";
import {useCallback, useRef, useTransition} from "react";
import Webcam from "react-webcam";
import type {SSRServiceResource} from "@/language-data/unirefund/SSRService";

export function WebcamCapture({
  languageData,
  type,
  handleImage,
}: {
  languageData: SSRServiceResource;
  type: "document" | "selfie";
  handleImage: (imageSrc: string | null) => void;
}) {
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: type === "document" ? "environment" : "user",
  };
  const [isPending, startTransition] = useTransition();
  const webcamRef = useRef<Webcam>(null);
  const capture = useCallback(() => {
    startTransition(() => {
      if (!webcamRef.current) return;
      const imageSrc = webcamRef.current.getScreenshot();
      handleImage(imageSrc);
    });
  }, [webcamRef]);
  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="border-primary absolute left-4 top-4 h-8 w-8 border-l-2 border-t-2" />
        <div className="border-primary absolute right-4 top-4 h-8 w-8 border-r-2 border-t-2" />
        <div className="border-primary absolute bottom-4 left-4 h-8 w-8 border-b-2 border-l-2" />
        <div className="border-primary absolute bottom-4 right-4 h-8 w-8 border-b-2 border-r-2" />
      </div>
      <div className="relative flex max-w-full items-center justify-center">
        {isPending ? <Skeleton className="absolute inset-0 z-10 h-full w-full rounded-xl bg-white/60" /> : null}
        <Webcam
          audio={false}
          className="rounded-xl"
          height={720}
          minScreenshotHeight={1080}
          minScreenshotWidth={1920}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          screenshotQuality={1}
          videoConstraints={videoConstraints}
          width={1280}
        />
        <Button
          className="absolute -bottom-[1rem] z-20 rounded-full"
          disabled={isPending}
          onClick={capture}
          size="icon">
          <Camera className="h-4 w-4" />
          <span className="sr-only">{languageData.ScanDocument}</span>
        </Button>
      </div>
    </div>
  );
}
