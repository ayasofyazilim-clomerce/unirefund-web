"use client";

import {Button} from "@/components/ui/button";
import {ArrowRight} from "lucide-react";
import Image from "next/image";

export interface DocumentOnboardingProps {
  title: string;
  description: string;
  imageUrl: string;
  onContinue: () => void;
  tips?: string[];
}

export function DocumentOnboarding({title, description, imageUrl, onContinue, tips}: DocumentOnboardingProps) {
  return (
    <div className="mx-auto max-h-[85vh] space-y-6 overflow-y-auto  md:max-h-none">
      <div className="overflow-hidden rounded-xl border border-black/10 shadow-sm">
        <div className="bg-primary/10 border-b p-5">
          <h3 className="mb-2 text-xl font-semibold text-black">{title}</h3>
          <p className="text-sm text-black/70">{description}</p>
        </div>

        <div className="flex flex-col items-center bg-white p-5">
          <Image src={imageUrl} alt={title} width={240} height={160} className="mb-6 object-contain" />

          {tips && tips.length > 0 && (
            <div className="mb-6 w-full space-y-3">
              <h4 className="text-sm font-medium text-black/80">Tips:</h4>
              <ul className="space-y-2">
                {tips.map((tip, index) => (
                  <li key={index} className="flex items-start text-sm">
                    <span className="text-primary mr-2">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Button onClick={onContinue} className="w-full">
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
