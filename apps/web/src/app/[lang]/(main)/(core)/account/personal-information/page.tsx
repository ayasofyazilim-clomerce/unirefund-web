"use server";

import {getPersonalInfomationApi} from "@repo/actions/core/AccountService/actions";
import ErrorComponent from "@repo/ui/components/error-component";
import {structuredError} from "@repo/utils/api";
import {signOutServer} from "@repo/utils/auth";
import {auth} from "@repo/utils/auth/next-auth";
import {isRedirectError} from "next/dist/client/components/redirect";
import {getResourceData} from "src/language-data/core/AccountService";
import PersonalInformation from "./_components/personal-information";

async function getApiRequests() {
  try {
    const session = await auth();
    const requiredRequests = await Promise.all([getPersonalInfomationApi(session)]);
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
  return <PersonalInformation languageData={languageData} personalInformationData={response.data} />;
}
