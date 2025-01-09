"use server";

import type { GetApiAuditLoggingAuditLogsData } from "@ayasofyazilim/saas/AdministrationService";
import { getAuditLogsApi } from "src/actions/core/AdministrationService/actions";
import { getResourceData } from "src/language-data/core/AdministrationService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import ErrorComponent from "../../../_components/error-component";
import AuditLogsTable from "./_components/table";

export default async function Page({
  params,
  searchParams,
}: {
  params: { lang: string };
  searchParams: GetApiAuditLoggingAuditLogsData;
}) {
  const { lang } = params;
  const { languageData } = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["AuditLogging.AuditLogs"],
    lang,
  });
  const auditLogsResponse = await getAuditLogsApi(searchParams);
  if (isErrorOnRequest(auditLogsResponse, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={auditLogsResponse.message}
      />
    );
  }

  return (
    <AuditLogsTable
      languageData={languageData}
      response={auditLogsResponse.data}
    />
  );
}
