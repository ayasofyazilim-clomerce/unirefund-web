"use server";

import {structuredError} from "@repo/utils/api";
import {getPersonalInfomationApi} from "@repo/actions/core/AccountService/actions";
import ErrorComponent from "@repo/ui/components/error-component";
import {isRedirectError} from "next/dist/client/components/redirect";
import {signOutServer} from "@repo/utils/auth";
import {getResourceData} from "src/language-data/unirefund/SSRService";
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
  const {languageData} = await getResourceData(lang);

  const apiRequests = await getApiRequests();

  if ("message" in apiRequests) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={apiRequests.message}
        showHomeButton={false}
        signOutServer={signOutServer}
      />
    );
  }
  const [response] = apiRequests.requiredRequests;
  return <Profile languageData={languageData} personalInformationData={response.data} />;
}
