"use server";

import type {GetApiSettingServiceVatData} from "@ayasofyazilim/saas/SettingService";
import {auth} from "@repo/utils/auth/next-auth";
import {isUnauthorized} from "@repo/utils/policies";
import ErrorComponent from "@repo/ui/components/error-component";
import {getVatsApi} from "src/actions/unirefund/SettingService/actions";
import {getResourceData} from "src/language-data/unirefund/SettingService";
import VatsTable from "./_components/table";

async function getApiRequests(searchParams: GetApiSettingServiceVatData) {
  try {
    const session = await auth();
    const apiRequests = await Promise.all([getVatsApi(searchParams, session)]);
    return {
      type: "success" as const,
      data: apiRequests,
    };
  } catch (error) {
    const err = error as {data?: string; message?: string};
    return {
      type: "error" as const,
      message: err.message,
    };
  }
}

export default async function Page({
  params,
  searchParams,
}: {
  params: {lang: string};
  searchParams: GetApiSettingServiceVatData;
}) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({requiredPolicies: ["SettingService.Vats"], lang});

  const apiRequests = await getApiRequests(searchParams);
  if (apiRequests.type === "error") {
    return <ErrorComponent languageData={languageData} message={apiRequests.message || "Unknown error occurred"} />;
  }
  const [vatResponse] = apiRequests.data;

  return <VatsTable languageData={languageData} response={vatResponse.data} />;
}
