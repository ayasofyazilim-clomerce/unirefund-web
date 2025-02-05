"use server";

import type {GetApiIdentitySecurityLogsData} from "@ayasofyazilim/saas/IdentityService";
import {isUnauthorized} from "@repo/utils/policies";
import {getIdentitySecurityLogsApi} from "src/actions/core/IdentityService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import {getResourceData} from "src/language-data/core/IdentityService";
import {isErrorOnRequest} from "src/utils/page-policy/utils";
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
