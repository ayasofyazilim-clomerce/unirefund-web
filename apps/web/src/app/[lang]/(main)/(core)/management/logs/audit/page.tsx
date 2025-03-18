"use server";

import type {GetApiAuditLoggingAuditLogsData} from "@ayasofyazilim/core-saas/AdministrationService";
import {auth} from "@repo/utils/auth/next-auth";
import {isUnauthorized} from "@repo/utils/policies";
import ErrorComponent from "@repo/ui/components/error-component";
import {getAuditLogsApi} from "@repo/actions/core/AdministrationService/actions";
import {getResourceData} from "src/language-data/core/AdministrationService";
import AuditLogsTable from "./_components/table";

async function getApiRequests(searchParams: GetApiAuditLoggingAuditLogsData) {
  try {
    const session = await auth();
    const apiRequests = await Promise.all([getAuditLogsApi(searchParams, session)]);
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
  searchParams: GetApiAuditLoggingAuditLogsData;
}) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["AuditLogging.AuditLogs"],
    lang,
  });

  const apiRequests = await getApiRequests(searchParams);
  if (apiRequests.type === "error") {
    return <ErrorComponent languageData={languageData} message={apiRequests.message || "Unknown error occurred"} />;
  }
  const [auditLogsResponse] = apiRequests.data;

  return <AuditLogsTable languageData={languageData} response={auditLogsResponse.data} />;
}
