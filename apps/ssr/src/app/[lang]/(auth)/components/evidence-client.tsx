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
  authType?: "login" | "register" | "reset-password";
}

export function EvidenceClient({languageData, authType = "login"}: EvidenceClientProps) {
  const router = useRouter();
  const lang = useParams().lang as string;

  const isLogin = authType === "login";
  const isRegister = authType === "register";

  // Dinamik path'ler
  let basePath: string;
  let emailPath: string;
  let passportPath: string;
  let altPath: string;

  if (isLogin) {
    basePath = "evidence-new-login";
    emailPath = "login-with-email";
    passportPath = "login-with-passport";
    altPath = "evidence-new-register";
  } else if (isRegister) {
    basePath = "evidence-new-register";
    emailPath = "register-with-email";
    passportPath = "register-with-passport";
    altPath = "evidence-new-login";
  } else {
    basePath = "evidence-new-reset-password";
    emailPath = "reset-password-with-email";
    passportPath = "reset-password-with-passport";
    altPath = "evidence-new-login";
  }

  // Dinamik content
  let headerTitle: string;
  let headerSubtitle: string;
  let emailDescription: string;
  let passportDescription: string;

  if (isLogin) {
    headerTitle = languageData.Login;
    headerSubtitle = languageData["Evidence.Subtitle"];
    emailDescription = languageData["Evidence.EmailPasswordDescription"];
    passportDescription = languageData["Evidence.PassportDescription"];
  } else if (isRegister) {
    headerTitle = languageData.Register;
    headerSubtitle = languageData["Evidence.RegisterSubtitle"];
    emailDescription = languageData["Evidence.EmailPasswordRegisterDescription"];
    passportDescription = languageData["Evidence.PassportRegisterDescription"];
  } else {
    headerTitle = languageData.ResetPassword;
    headerSubtitle = languageData["Evidence.ResetPasswordSubtitle"];
    emailDescription = languageData["Evidence.EmailPasswordResetDescription"];
    passportDescription = languageData["Evidence.PassportResetDescription"];
  }

  let emailFeatures: string[];
  let passportFeatures: string[];

  if (isLogin) {
    emailFeatures = [
      languageData["Evidence.EmailPasswordFeature1"],
      languageData["Evidence.EmailPasswordFeature2"],
      languageData["Evidence.EmailPasswordFeature3"],
    ];
    passportFeatures = [
      languageData["Evidence.PassportFeature1"],
      languageData["Evidence.PassportFeature2"],
      languageData["Evidence.PassportFeature3"],
    ];
  } else if (isRegister) {
    emailFeatures = [
      languageData["Evidence.EmailPasswordRegisterFeature1"],
      languageData["Evidence.EmailPasswordRegisterFeature2"],
      languageData["Evidence.EmailPasswordRegisterFeature3"],
    ];
    passportFeatures = [
      languageData["Evidence.PassportRegisterFeature1"],
      languageData["Evidence.PassportRegisterFeature2"],
      languageData["Evidence.PassportRegisterFeature3"],
    ];
  } else {
    emailFeatures = [
      languageData["Evidence.EmailPasswordResetFeature1"],
      languageData["Evidence.EmailPasswordResetFeature2"],
      languageData["Evidence.EmailPasswordResetFeature3"],
    ];
    passportFeatures = [
      languageData["Evidence.PassportResetFeature1"],
      languageData["Evidence.PassportResetFeature2"],
      languageData["Evidence.PassportResetFeature3"],
    ];
  }

  let emailButtonText: string;
  let passportButtonText: string;
  let footerLinkText: string;

  if (isLogin) {
    emailButtonText = languageData["Evidence.EmailPasswordButton"];
    passportButtonText = languageData["Evidence.PassportButton"];
    footerLinkText = languageData["Auth.NotMember"];
  } else if (isRegister) {
    emailButtonText = languageData["Evidence.EmailPasswordRegisterButton"];
    passportButtonText = languageData["Evidence.PassportRegisterButton"];
    footerLinkText = languageData["Evidence.AlreadyHaveAccount"];
  } else {
    emailButtonText = languageData["Evidence.EmailPasswordResetButton"];
    passportButtonText = languageData["Evidence.PassportResetButton"];
    footerLinkText = languageData["Auth.Member"];
  }

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
