"use server";

import {structuredError} from "@repo/utils/api";
import {getPersonalInfomationApi} from "@repo/actions/core/AccountService/actions";
import ErrorComponent from "@repo/ui/components/error-component";
import {isRedirectError} from "next/dist/client/components/redirect";
import {signOutServer} from "@repo/utils/auth";
import {auth} from "@repo/utils/auth/next-auth";
import {getResourceData as ssrGetResourceData} from "src/language-data/unirefund/SSRService";
import {getResourceData as accountGetResourceData} from "src/language-data/core/AccountService";
import Profile from "./client";

async function getApiRequests() {
  try {
    const requiredRequests = await Promise.all([getPersonalInfomationApi()]);
    const optionalRequests = await Promise.allSettled([]);
    return {requiredRequests, optionalRequests};
  } catch (error) {
    if (!isRedirectError(error)) {
      return structuredError(error);
    }
    throw error;
  }
}
export default async function Page({params}: {params: {lang: string}}) {
  const {lang} = params;
  const {languageData: ssrLanguageData} = await ssrGetResourceData(lang);
  const {languageData: accountLanguageData} = await accountGetResourceData(lang);

  const apiRequests = await getApiRequests();

  const session = await auth();

  if ("message" in apiRequests) {
    return (
      <ErrorComponent
        languageData={ssrLanguageData}
        message={apiRequests.message}
        showHomeButton={false}
        signOutServer={signOutServer}
        redirectPath="/evidence/login"
      />
    );
  }
  const [response] = apiRequests.requiredRequests;
  return (
    <Profile
      accountLanguageData={accountLanguageData}
      availableLocals={process.env.SUPPORTED_LOCALES?.split(",") || []}
      novu={{
        appId: process.env.NOVU_APP_IDENTIFIER || "",
        appUrl: process.env.NOVU_APP_URL || "",
        subscriberId: session?.user?.sub || "",
      }}
      personalInformationData={response.data}
      ssrLanguageData={ssrLanguageData}
    />
  );
}
