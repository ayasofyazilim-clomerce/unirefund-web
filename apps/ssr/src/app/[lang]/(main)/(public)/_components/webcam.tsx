"use client";
import * as Avatar from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import * as Dialog from "@/components/ui/dialog";
import {cn} from "@/lib/utils";
import {RefreshCw} from "lucide-react";
import {useCallback, useRef, useState, useTransition, useEffect} from "react";
import Webcam from "react-webcam";
import {useParams} from "next/navigation";

export function WebcamCapture({
  handleImage,
  type,
  placeholder,
  allowCameraSwitch = false,
  capturedImage,
}: {
  type: "document" | "selfie";
  handleImage: (imageSrc: string | null) => void;
  allowCameraSwitch?: boolean;
  placeholder?: React.ReactElement;
  capturedImage?: string | null;
}) {
  const [isPending, startTransition] = useTransition();
  const [facingMode, setFacingMode] = useState<"user" | "environment">(type === "selfie" ? "user" : "environment");
  const [image, setImage] = useState<string | null>(capturedImage || null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  type Timeout = ReturnType<typeof setTimeout>;
  const videoCheckIntervalRef = useRef<Timeout | null>(null);
  const retryCountRef = useRef(0);
  const params = useParams();
  const lang = params.lang as string;

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

  // Create a more reliable capture function that doesn't depend on React state
  const captureImageSafely = useCallback(() => {
    return new Promise<string | null>((resolve) => {
      if (!webcamRef.current?.video) {
        resolve(null);
        return;
      }

      const video = webcamRef.current.video;

      // If video is not ready yet, wait for it
      if (video.readyState < 2) {
        // Set a timeout in case the event never fires
        const timeout = setTimeout(() => {
          resolve(null);
        }, 5000);

        // Listen for the video to be ready
        const handleVideoReady = () => {
          clearTimeout(timeout);

          // Even after the event, double-check dimensions
          if (video.videoWidth <= 0 || video.videoHeight <= 0) {
            resolve(null);
            return;
          }

          // Now safely capture
          void tryCaptureFromVideo(video).then(resolve);
        };

        video.addEventListener("loadeddata", handleVideoReady, {once: true});
        return;
      }

      // Video is already ready, capture directly
      void tryCaptureFromVideo(video).then(resolve);
    });
  }, [webcamRef]);

  // Helper function to safely draw video to canvas
  const tryCaptureFromVideo = async (video: HTMLVideoElement): Promise<string | null> => {
    try {
      // Wait a frame for good measure
      await new Promise(requestAnimationFrame);

      // Create a canvas with the exact dimensions of the video
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Get context and draw
      const context = canvas.getContext("2d");
      if (!context) {
        return null;
      }

      // Draw the frame
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert to data URL
      return canvas.toDataURL("image/jpeg", 0.9);
    } catch {
      return null;
    }
  };

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
            aspectRatio: 16 / 9,
            width: 1280,
            height: 720,
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
              <img
                alt={lang === "tr" ? "Çekilmiş Fotoğraf" : "Captured"}
                className="rounded-md"
                src={image ? image : ""}
              />
            </Dialog.DialogContent>
          </Dialog.Dialog>
        </div>
        <div className="capture flex justify-center">
          <Button
            className="size-10 rounded-full border-2 border-white bg-white ring ring-inset ring-black transition-all hover:bg-white hover:ring-4"
            disabled={isPending || !isVideoReady}
            onClick={capture}>
            <span className="sr-only">{lang === "tr" ? "Çek" : "Capture"}</span>
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
              <span className="sr-only">{lang === "tr" ? "Kamerayı Değiştir" : "Switch Camera"}</span>
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
