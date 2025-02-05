"use server";

import type { GetApiAuditLoggingAuditLogsEntityChangesData } from "@ayasofyazilim/saas/AdministrationService";
import { isUnauthorized } from "@repo/utils/policies";
import { getAuditLogsEntityChangesApi } from "src/actions/core/AdministrationService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import { getResourceData } from "src/language-data/core/AdministrationService";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import EntityChangesTable from "./_components/table";

export default async function Page({
  params,
  searchParams,
}: {
  params: { lang: string };
  searchParams: GetApiAuditLoggingAuditLogsEntityChangesData;
}) {
  const { lang } = params;
  const { languageData } = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["AuditLogging.AuditLogs"],
    lang,
  });

  const auditLogsEntityChangesResponse =
    await getAuditLogsEntityChangesApi(searchParams);
  if (isErrorOnRequest(auditLogsEntityChangesResponse, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={auditLogsEntityChangesResponse.message}
      />
    );
  }

  return (
    <EntityChangesTable
      languageData={languageData}
      response={auditLogsEntityChangesResponse.data}
    />
  );
}
