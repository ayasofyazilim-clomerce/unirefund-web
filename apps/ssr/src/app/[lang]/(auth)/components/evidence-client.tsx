"use client";

import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {FileText, Mail} from "lucide-react";
import Link from "next/link";
import {useParams, useRouter} from "next/navigation";
import type {AccountServiceResource} from "src/language-data/core/AccountService";
import {getBaseLink} from "@/utils";

interface EvidenceClientProps {
  languageData: AccountServiceResource;
  authType?: "login" | "register";
}

export function EvidenceClient({languageData, authType = "login"}: EvidenceClientProps) {
  const router = useRouter();
  const lang = useParams().lang as string;

  const isLogin = authType === "login";

  // Dinamik path'ler
  const basePath = isLogin ? "evidence-new-login" : "evidence-new-register";
  const emailPath = isLogin ? "login-with-email" : "register-with-email";
  const passportPath = isLogin ? "login-with-passport" : "register-with-passport";
  const altPath = isLogin ? "evidence-new-register" : "evidence-new-login";

  // Dinamik content
  const headerTitle = isLogin ? languageData.Login : languageData.Register;
  const headerSubtitle = isLogin ? languageData["Evidence.Subtitle"] : languageData["Evidence.RegisterSubtitle"];

  const emailDescription = isLogin
    ? languageData["Evidence.EmailPasswordDescription"]
    : languageData["Evidence.EmailPasswordRegisterDescription"];

  const passportDescription = isLogin
    ? languageData["Evidence.PassportDescription"]
    : languageData["Evidence.PassportRegisterDescription"];

  const emailFeatures = isLogin
    ? [
        languageData["Evidence.EmailPasswordFeature1"],
        languageData["Evidence.EmailPasswordFeature2"],
        languageData["Evidence.EmailPasswordFeature3"],
      ]
    : [
        languageData["Evidence.EmailPasswordRegisterFeature1"],
        languageData["Evidence.EmailPasswordRegisterFeature2"],
        languageData["Evidence.EmailPasswordRegisterFeature3"],
      ];

  const passportFeatures = isLogin
    ? [
        languageData["Evidence.PassportFeature1"],
        languageData["Evidence.PassportFeature2"],
        languageData["Evidence.PassportFeature3"],
      ]
    : [
        languageData["Evidence.PassportRegisterFeature1"],
        languageData["Evidence.PassportRegisterFeature2"],
        languageData["Evidence.PassportRegisterFeature3"],
      ];

  const emailButtonText = isLogin
    ? languageData["Evidence.EmailPasswordButton"]
    : languageData["Evidence.EmailPasswordRegisterButton"];

  const passportButtonText = isLogin
    ? languageData["Evidence.PassportButton"]
    : languageData["Evidence.PassportRegisterButton"];

  const footerLinkText = isLogin ? languageData["Auth.NotMember"] : languageData["Evidence.AlreadyHaveAccount"];

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-4xl p-2 md:p-4">
        {/* Header */}
        <div className="mb-2 text-center md:mb-6">
          <div className="flex items-center justify-center">
            <h1 className="text-xl font-bold text-gray-900 md:text-2xl">{headerTitle}</h1>
          </div>
          <p className="mt-1 text-xs text-gray-600 md:text-sm">{headerSubtitle}</p>
        </div>

        {/* Authentication Method Selection */}
        <div className="grid gap-4 md:grid-cols-2 md:gap-6 ">
          {/* Email/Password Panel */}
          <Card
            className="hover:border-primary/50 flex cursor-pointer flex-col transition-all hover:shadow-lg"
            onClick={() => {
              router.push(`/${basePath}/${emailPath}`);
            }}>
            <CardHeader className="pb-4 text-center">
              <div className=" flex justify-center ">
                <Mail className="text-primary h-10 w-10 md:h-12 md:w-12" />
              </div>
              <CardTitle className="text-lg font-bold text-gray-900 md:text-xl">
                {languageData["Evidence.EmailPasswordTitle"]}
              </CardTitle>
              <CardDescription className="text-xs text-gray-600 md:text-sm">{emailDescription}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col pt-5">
              <div className="text-muted-foreground flex-1 space-y-2 text-xs md:space-y-3 md:text-sm">
                {emailFeatures.map((feature, index) => (
                  <div className="flex items-center" key={index}>
                    <div className="bg-primary mr-3 h-2 w-2 rounded-full" />
                    {feature}
                  </div>
                ))}
              </div>
              <Link href={`/${basePath}/${emailPath}`}>
                <Button className="mt-4 w-full text-white md:mt-6" variant="default">
                  {emailButtonText}
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Passport/Liveness Panel */}
          <Card
            className="hover:border-primary/50 flex cursor-pointer flex-col transition-all hover:shadow-lg"
            onClick={() => {
              router.push(`/${basePath}/${passportPath}`);
            }}>
            <CardHeader className="pb-4 text-center">
              <div className=" flex justify-center ">
                <div className="relative">
                  <FileText className="text-primary h-10 w-10 md:h-12 md:w-12" />
                </div>
              </div>
              <CardTitle className="text-lg font-bold text-gray-900 md:text-xl">
                {languageData["Evidence.PassportTitle"]}
              </CardTitle>
              <CardDescription className="text-xs text-gray-600 md:text-sm">{passportDescription}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col pt-0">
              <div className="text-muted-foreground flex-1 space-y-2 text-xs md:space-y-3 md:text-sm">
                {passportFeatures.map((feature, index) => (
                  <div className="flex items-center" key={index}>
                    <div className="bg-primary mr-3 h-2 w-2 rounded-full" />
                    {feature}
                  </div>
                ))}
              </div>
              <Link href={`/${basePath}/${passportPath}`}>
                <Button className="mt-4 w-full text-white md:mt-6" variant="default">
                  {passportButtonText}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <div className="mt-4 flex w-full items-center">
          <Link
            className="text-muted-foreground hover:text-primary peer order-2 px-4 text-center text-sm transition-colors duration-200"
            href={getBaseLink(altPath, lang)}>
            {footerLinkText}
          </Link>

          <div
            aria-hidden
            className="bg-muted-foreground/20 peer-hover:bg-primary order-1 h-px flex-1 transition-colors duration-200"
          />
          <div
            aria-hidden
            className="bg-muted-foreground/20 peer-hover:bg-primary order-3 h-px flex-1 transition-colors duration-200"
          />
        </div>
      </div>
    </div>
  );
}
