"use server";

import type {GetApiIdentitySecurityLogsData} from "@ayasofyazilim/core-saas/IdentityService";
import {isUnauthorized} from "@repo/utils/policies";
import {isErrorOnRequest} from "@repo/utils/api";
import ErrorComponent from "@repo/ui/components/error-component";
import {getIdentitySecurityLogsApi} from "@repo/actions/core/IdentityService/actions";
import {getResourceData} from "src/language-data/core/IdentityService";
import SecurityLogsTable from "./_components/table";

export default async function Page({
  params,
  searchParams,
}: {
  params: {lang: string};
  searchParams: GetApiIdentitySecurityLogsData;
}) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["AbpIdentity.SecurityLogs"],
    lang,
  });

  const securityLogsResponse = await getIdentitySecurityLogsApi(searchParams);
  if (isErrorOnRequest(securityLogsResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={securityLogsResponse.message} />;
  }

  return <SecurityLogsTable languageData={languageData} response={securityLogsResponse.data} />;
}
