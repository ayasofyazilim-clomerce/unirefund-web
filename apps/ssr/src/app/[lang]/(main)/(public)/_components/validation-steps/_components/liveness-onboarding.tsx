"use client";

import React, {useState, useEffect} from "react";
import {Button} from "@/components/ui/button";
import {ArrowRight} from "lucide-react";
import Image from "next/image";
import type {SSRServiceResource} from "@/language-data/unirefund/SSRService";
import LeftSide from "public/left.png";
import RightSide from "public/right.png";
import StraightSide from "public/straight.png";

export interface LivenessOnboardingProps {
  title: string;
  description: string;
  onContinue: () => void;
  steps: {title: string; description: string; imageSrc: string}[];
  languageData: SSRServiceResource;
}

export function LivenessOnboarding({onContinue, languageData}: LivenessOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [displayStep, setDisplayStep] = useState(0); // Actual step shown to user

  // Define our custom steps with clear, detailed instructions
  const enhancedSteps = [
    {
      title: languageData["LivenessDetection.LookStraight"] || "Düz Bakın",
      description: "Yüzünüzü ekranın tam ortasına konumlandırın ve sabit tutun. Bu pozisyonda 3 saniye bekleyin.",
      image: StraightSide,
    },
    {
      title: languageData["LivenessDetection.TurnLeft"] || "Sola Dönün",
      description: "Başınızı hafifçe sola çevirin ve 3 saniye boyunca bu pozisyonda hareketsiz kalın.",
      image: LeftSide,
    },
    {
      title: languageData["LivenessDetection.TurnRight"] || "Sağa Dönün",
      description: "Başınızı hafifçe sağa çevirin ve 3 saniye boyunca bu pozisyonda hareketsiz kalın.",
      image: RightSide,
    },
  ];

  // Update displayStep when animation completes
  useEffect(() => {
    if (!fadeOut) {
      setDisplayStep(currentStep);
    }
  }, [fadeOut, currentStep]);

  const goToNextStep = () => {
    if (isAnimating) return; // Prevent multiple clicks during animation

    setFadeOut(true);
    setIsAnimating(true);

    setTimeout(() => {
      if (currentStep < enhancedSteps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        onContinue();
        return; // Exit early if we're continuing to the next section
      }

      setTimeout(() => {
        setFadeOut(false);
        setIsAnimating(false);
      }, 300); // Fade in duration
    }, 300); // Fade out duration
  };

  // Apply initial fade-in effect when component mounts
  useEffect(() => {
    setFadeOut(false);
  }, []);

  return (
    <div className="mx-auto space-y-6 overflow-hidden overflow-y-auto md:max-h-none">
      <div className="overflow-hidden">
        <div className="flex flex-col items-center bg-white p-5">
          {/* <div className="mb-6 flex w-full justify-between">
            {enhancedSteps.map((_, index) => (
              <div
                key={index}
                className={`mx-1 h-2 flex-1 rounded-full ${index <= currentStep ? "bg-primary" : "bg-gray-200"}`}
              />
            ))}
          </div> */}

          <div className="mb-6 text-center">
            <div
              className={`transition-all duration-500 ease-in-out ${fadeOut ? "-translate-y-3 transform opacity-0" : "translate-y-0 transform opacity-100"}`}>
              <h4 className="mb-2 text-lg font-medium">{enhancedSteps[displayStep].title}</h4>
              <p className="text-sm text-gray-600">{enhancedSteps[displayStep].description}</p>
            </div>
          </div>

          <div className="mb-4">
            <Image
              src={enhancedSteps[displayStep].image}
              alt={enhancedSteps[displayStep].title}
              width={200}
              height={100}
              className="mx-auto h-auto max-w-full"
              priority
            />
          </div>

          <Button onClick={goToNextStep} className="w-full" disabled={isAnimating}>
            {currentStep < enhancedSteps.length - 1 ? (
              <>
                {languageData.Next || "İlerle"} <ArrowRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                {"Canlılık Kontrolüne Başla"} <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
