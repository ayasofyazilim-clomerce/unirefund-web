"use server";

import type {GetApiSettingServiceProductGroupData} from "@ayasofyazilim/saas/SettingService";
import {auth} from "@repo/utils/auth/next-auth";
import {isUnauthorized} from "@repo/utils/policies";
import ErrorComponent from "@repo/ui/components/error-component";
import {getProductGroupsApi} from "@repo/actions/unirefund/SettingService/actions";
import {getResourceData} from "src/language-data/unirefund/SettingService";
import ProductGroupsTable from "./_components/table";

async function getApiRequests(searchParams: GetApiSettingServiceProductGroupData) {
  try {
    const session = await auth();
    const apiRequests = await Promise.all([getProductGroupsApi(searchParams, session)]);
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
  searchParams: GetApiSettingServiceProductGroupData;
}) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["SettingService.ProductGroups"],
    lang,
  });

  const apiRequests = await getApiRequests(searchParams);
  if (apiRequests.type === "error") {
    return <ErrorComponent languageData={languageData} message={apiRequests.message || "Unknown error occurred"} />;
  }
  const [productGroupsResponse] = apiRequests.data;

  return <ProductGroupsTable languageData={languageData} response={productGroupsResponse.data} />;
}
