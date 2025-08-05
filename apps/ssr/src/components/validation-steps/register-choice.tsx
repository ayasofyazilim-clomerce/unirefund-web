"use client";

import * as React from "react";
import {Button} from "@/components/ui/button";
import {CheckCircle as CheckIcon, Clock, LogIn, ShieldCheck} from "lucide-react";
import Link from "next/link";
import {useParams} from "next/navigation";
import {getBaseLink} from "@/utils";
import type {SSRServiceResource} from "@/language-data/unirefund/SSRService";

export type StepId =
  | "start"
  | "register-choice"
  | "scan-front"
  | "scan-back"
  | "scan-passport"
  | "liveness-detector"
  | "fail"
  | "finish";

export interface Stepper {
  goTo: (step: StepId) => void;
}

export default function RegisterChoice({languageData, stepper}: {languageData: SSRServiceResource; stepper: Stepper}) {
  const {lang} = useParams<{lang: string}>();

  return (
    <div className="md:h-auto ">
      <div className="space-y-4 text-center">
        <h2 className="text-xl font-semibold text-gray-900">Choose Registration Method</h2>

        <div className="rounded-lg bg-gray-50 p-4 text-left">
          <h3 className="mb-2 font-medium text-gray-900">Why verify your identity?</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <CheckIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-black" />
              <span className="text-sm text-gray-700">Get your refunds faster with priority processing</span>
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-black" />
              <span className="text-sm text-gray-700">Enhanced security for your transactions and personal data</span>
            </li>
            <li className="flex items-center gap-2">
              <Clock className="mt-0.5 h-5 w-5 flex-shrink-0 text-black" />
              <span className="text-sm text-gray-700">One-time process for all future refunds</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            className="bg-primary hover:bg-primary/90 w-full"
            onClick={() => {
              stepper.goTo("start");
            }}>
            Verify and Register
          </Button>
          <Button
            className="border-primary text-primary hover:bg-primary/5 w-full"
            onClick={() => {
              // Navigate to registration without verification
              window.location.href = getBaseLink("register", lang);
            }}
            variant="outline">
            Register Without Verification
          </Button>
        </div>
      </div>

      <div className="mt-2 text-center">
        <div className="mx-auto flex max-w-md flex-wrap items-center justify-center gap-1">
          <Link
            className="hover:text-primary flex items-center  justify-center gap-1 text-sm text-gray-500"
            href={getBaseLink("login", lang)}>
            {languageData.AlreadyHaveAnAccount}
            <LogIn className="inline h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
