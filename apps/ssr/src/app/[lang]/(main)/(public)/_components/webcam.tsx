"use client";
import * as Avatar from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import * as Dialog from "@/components/ui/dialog";
import {cn} from "@/lib/utils";
import {RefreshCw} from "lucide-react";
import {useCallback, useRef, useState, useTransition, useEffect} from "react";
import Webcam from "react-webcam";
import type {SSRServiceResource} from "@/language-data/unirefund/SSRService";

export function WebcamCapture({
  handleImage,
  type,
  placeholder,
  allowCameraSwitch = false,
  capturedImage,
  languageData,
}: {
  type: "document" | "selfie";
  handleImage: (imageSrc: string | null) => void;
  allowCameraSwitch?: boolean;
  placeholder?: React.ReactElement;
  capturedImage?: string | null;
  languageData: SSRServiceResource;
}) {
  const [isPending, startTransition] = useTransition();
  const [facingMode, setFacingMode] = useState<"user" | "environment">(type === "selfie" ? "user" : "environment");
  const [image, setImage] = useState<string | null>(capturedImage || null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  type Timeout = ReturnType<typeof setTimeout>;
  const videoCheckIntervalRef = useRef<Timeout | null>(null);
  const retryCountRef = useRef(0);

  // Cleanup function for intervals
  const clearVideoCheckInterval = useCallback(() => {
    if (videoCheckIntervalRef.current) {
      clearInterval(videoCheckIntervalRef.current);
      videoCheckIntervalRef.current = null;
    }
  }, []);

  // Check if video is ready and has valid dimensions
  const checkVideoReady = useCallback(() => {
    if (!webcamRef.current?.video) return false;

    const video = webcamRef.current.video;
    return video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0;
  }, []);

  // Handle video initialization with continuous checking
  const handleUserMedia = useCallback(() => {
    // Clear any existing interval
    clearVideoCheckInterval();
    retryCountRef.current = 0;

    // Start checking video readiness
    videoCheckIntervalRef.current = setInterval(() => {
      if (checkVideoReady()) {
        setIsVideoReady(true);
        clearVideoCheckInterval();
      } else {
        retryCountRef.current++;

        // If we've tried too many times, let's refresh the component
        if (retryCountRef.current > 10) {
          clearVideoCheckInterval();

          const currentFacingMode = facingMode;
          setFacingMode("user"); // Tür zaten tanımlıysa burada ekstra casting gerekmez

          setTimeout(() => {
            setFacingMode(currentFacingMode);
          }, 100);
        }
      }
    }, 500);

    return () => {
      clearVideoCheckInterval();
    };
  }, [clearVideoCheckInterval, checkVideoReady, facingMode]);

  // Clean up intervals on unmount
  useEffect(() => {
    return () => {
      clearVideoCheckInterval();
    };
  }, [clearVideoCheckInterval]);

  // Use the built-in getScreenshot method instead of canvas-based capture
  const captureImageSafely = useCallback(() => {
    return new Promise<string | null>((resolve) => {
      if (!webcamRef.current) {
        resolve(null);
        return;
      }

      // If video is not ready yet, wait for it
      if (!isVideoReady) {
        // Set a timeout in case the video never becomes ready
        const timeout = setTimeout(() => {
          resolve(null);
        }, 5000);

        const checkIntervalId = setInterval(() => {
          if (checkVideoReady()) {
            clearTimeout(timeout);
            clearInterval(checkIntervalId);

            // Try to get screenshot after video is ready
            const screenshot = webcamRef.current?.getScreenshot();
            resolve(screenshot || null);
          }
        }, 200);

        return;
      }

      // Video is already ready, capture directly
      const screenshot = webcamRef.current.getScreenshot();
      resolve(screenshot || null);
    });
  }, [webcamRef, isVideoReady, checkVideoReady]);

  // Replace the original capture function with our safer version
  const capture = useCallback(() => {
    startTransition(async () => {
      const imageSrc = await captureImageSafely();

      if (imageSrc) {
        handleImage(imageSrc);
        setImage(imageSrc);
      }
    });
  }, [captureImageSafely, handleImage]);

  return (
    <div className="webcam-container grid overflow-hidden rounded-md bg-black">
      <div className="webcam relative p-2">
        {placeholder ? (
          <div className="absolute inset-2 z-[3] flex items-center justify-center">{placeholder}</div>
        ) : null}
        <Webcam
          audio={false}
          className={cn("background-transparent h-auto w-full rounded-md")}
          mirrored={type === "selfie"}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          screenshotQuality={1}
          onUserMedia={handleUserMedia}
          videoConstraints={{
            facingMode,
            width: 300,
            height: 300,
          }}
        />
      </div>
      <div className="actions grid grid-cols-3 items-center justify-center p-2 pt-0">
        <div className="captured size-10">
          <Dialog.Dialog>
            <Dialog.DialogTrigger>
              <Avatar.Avatar className="rounded-md">
                <Avatar.AvatarImage className="rounded-md object-cover" src={image ? image : ""} />
                <Avatar.AvatarFallback className="rounded-md bg-white/10" />
              </Avatar.Avatar>
            </Dialog.DialogTrigger>
            <Dialog.DialogContent className="w-max justify-center">
              <img alt={languageData["Webcam.CapturedPhoto"]} className="rounded-md" src={image ? image : ""} />
            </Dialog.DialogContent>
          </Dialog.Dialog>
        </div>
        <div className="capture flex justify-center">
          <Button
            className="size-10 rounded-full border-2 border-white bg-white ring ring-inset ring-black transition-all hover:bg-white hover:ring-4"
            disabled={isPending || !isVideoReady}
            onClick={capture}>
            <span className="sr-only">{languageData["Webcam.Capture"]}</span>
          </Button>
        </div>
        <div className="switch flex justify-end">
          {allowCameraSwitch ? (
            <Button
              className="size-8 rounded-full bg-white/10 p-0 text-white"
              onClick={() => {
                setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
                // Reset video ready state when switching cameras
                setIsVideoReady(false);
              }}
              variant="ghost">
              <RefreshCw className="size-4" />
              <span className="sr-only">{languageData["Webcam.SwitchCamera"]}</span>
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
