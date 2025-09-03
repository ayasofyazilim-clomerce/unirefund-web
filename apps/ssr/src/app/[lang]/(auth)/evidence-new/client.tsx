"use client";

import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {FileText, Mail, Shield} from "lucide-react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import type {AccountServiceResource} from "src/language-data/core/AccountService";

interface EvidenceClientProps {
  languageData: AccountServiceResource;
}

export function EvidenceClient({languageData}: EvidenceClientProps) {
  const router = useRouter();

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-4xl p-2 md:p-6">
        {/* Header */}
        <div className="mb-2 text-center md:mb-6">
          <div className="flex items-center justify-center md:mb-4">
            <Shield className="text-primary mr-2 h-6 w-6 md:h-8 md:w-8" />
            <h1 className="text-foreground text-2xl font-bold md:text-3xl">{languageData["Evidence.Title"]}</h1>
          </div>
          <p className="text-muted-foreground text-base md:text-lg">{languageData["Evidence.Subtitle"]}</p>
        </div>

        {/* Authentication Method Selection */}
        <div className="grid gap-4 md:grid-cols-2 md:gap-6">
          {/* Email/Password Panel */}
          <Card
            className="hover:border-primary/50 flex cursor-pointer flex-col transition-all hover:shadow-lg"
            onClick={() => {
              router.push("/evidence-new/login-with-email");
            }}>
            <CardHeader className="pb-4 text-center">
              <div className="mb-3 flex justify-center md:mb-4">
                <Mail className="text-primary h-10 w-10 md:h-12 md:w-12" />
              </div>
              <CardTitle className="text-lg md:text-xl">{languageData["Evidence.EmailPasswordTitle"]}</CardTitle>
              <CardDescription className="text-sm md:text-base">
                {languageData["Evidence.EmailPasswordDescription"]}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col pt-0">
              <div className="text-muted-foreground flex-1 space-y-2 text-sm md:space-y-3">
                <div className="flex items-center">
                  <div className="bg-primary mr-3 h-2 w-2 rounded-full" />
                  {languageData["Evidence.EmailPasswordFeature1"]}
                </div>
                <div className="flex items-center">
                  <div className="bg-primary mr-3 h-2 w-2 rounded-full" />
                  {languageData["Evidence.EmailPasswordFeature2"]}
                </div>
                <div className="flex items-center">
                  <div className="bg-primary mr-3 h-2 w-2 rounded-full" />
                  {languageData["Evidence.EmailPasswordFeature3"]}
                </div>
              </div>
              <Link href="/evidence-new/login-with-email">
                <Button className="mt-4 w-full text-white md:mt-6" variant="default">
                  {languageData["Evidence.EmailPasswordButton"]}
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Passport/Liveness Panel */}
          <Card className="hover:border-primary/50 flex cursor-pointer flex-col transition-all hover:shadow-lg">
            <CardHeader className="pb-4 text-center">
              <div className="mb-3 flex justify-center md:mb-4">
                <div className="relative">
                  <FileText className="text-primary h-10 w-10 md:h-12 md:w-12" />
                </div>
              </div>
              <CardTitle className="text-lg md:text-xl">{languageData["Evidence.PassportTitle"]}</CardTitle>
              <CardDescription className="text-sm md:text-base">
                {languageData["Evidence.PassportDescription"]}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col pt-0">
              <div className="text-muted-foreground flex-1 space-y-2 text-sm md:space-y-3">
                <div className="flex items-center">
                  <div className="bg-primary mr-3 h-2 w-2 rounded-full" />
                  {languageData["Evidence.PassportFeature1"]}
                </div>
                <div className="flex items-center">
                  <div className="bg-primary mr-3 h-2 w-2 rounded-full" />
                  {languageData["Evidence.PassportFeature2"]}
                </div>
                <div className="flex items-center">
                  <div className="bg-primary mr-3 h-2 w-2 rounded-full" />
                  {languageData["Evidence.PassportFeature3"]}
                </div>
              </div>
              <Button className="mt-4 w-full text-white md:mt-6" variant="default">
                {languageData["Evidence.PassportButton"]}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
