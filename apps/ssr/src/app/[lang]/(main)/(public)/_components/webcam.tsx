"use client";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import {cn} from "@/lib/utils";
import {Camera} from "lucide-react";
import {useCallback, useRef, useState, useTransition} from "react";
import Webcam from "react-webcam";

export function WebcamCapture({
  handleImage,
  type,
}: {
  type: "document" | "selfie";
  handleImage: (imageSrc: string | null) => void;
}) {
  const videoConstraints = {
    facingMode: type === "document" ? "environment" : "user",
  };
  const [isPending, startTransition] = useTransition();
  const [isHovering, setIsHovering] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  const capture = useCallback(() => {
    startTransition(() => {
      if (!webcamRef.current) return;
      const imageSrc = webcamRef.current.getScreenshot();
      handleImage(imageSrc);
    });
  }, [webcamRef, handleImage]);

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Orijinal çerçeveyi koruyalım */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="border-primary absolute left-2 top-2 h-6 w-6 border-l-2 border-t-2 sm:left-4 sm:top-4 sm:h-8 sm:w-8" />
        <div className="border-primary absolute right-2 top-2 h-6 w-6 border-r-2 border-t-2 sm:right-4 sm:top-4 sm:h-8 sm:w-8" />
        <div className="border-primary absolute bottom-2 left-2 h-6 w-6 border-b-2 border-l-2 sm:bottom-4 sm:left-4 sm:h-8 sm:w-8" />
        <div className="border-primary absolute bottom-2 right-2 h-6 w-6 border-b-2 border-r-2 sm:bottom-4 sm:right-4 sm:h-8 sm:w-8" />
      </div>

      <div
        className="relative flex w-full items-center justify-center"
        onMouseEnter={() => {
          setIsHovering(true);
        }}
        onMouseLeave={() => {
          setIsHovering(false);
        }}
        onTouchEnd={() => {
          setIsHovering(false);
        }}
        onTouchStart={() => {
          setIsHovering(true);
        }}>
        {isPending ? <Skeleton className="absolute inset-0 z-10 h-full w-full rounded-xl bg-white/60" /> : null}

        {/* Type indicator badge */}

        <Webcam
          audio={false}
          className={cn(
            "h-auto w-full rounded-lg shadow-lg transition-all duration-300",
            isHovering && "brightness-105",
          )}
          mirrored={type === "selfie"}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          screenshotQuality={1}
          videoConstraints={videoConstraints}
        />

        {/* Enhanced capture button area */}
        <div className="absolute -bottom-6  left-0 right-0 z-20 flex flex-col items-center">
          <Button
            className={cn(
              "relative overflow-hidden rounded-full bg-white shadow-xl transition-all",
              "border-3 border-primary focus:ring-primary/40 focus:ring-4",
              "p-0 hover:scale-105 hover:bg-gray-100",
              isPending ? "h-11 w-11" : "h-12 w-12",
              "flex items-center justify-center",
            )}
            disabled={isPending}
            onClick={capture}
            variant="outline">
            <Camera
              className={cn(
                "text-primary z-10 transition-all duration-300",
                isPending ? "h-7 w-7" : "h-7 w-7",
                isHovering && "scale-110",
              )}
              strokeWidth={2.5}
            />

            {isPending && (
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="bg-primary h-full w-full animate-ping rounded-full opacity-20" />
              </span>
            )}

            <span className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 opacity-0 transition-opacity hover:opacity-100" />
          </Button>
        </div>
      </div>
    </div>
  );
}
