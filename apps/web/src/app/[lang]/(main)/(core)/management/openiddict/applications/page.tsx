"use server";

import type {GetApiOpeniddictApplicationsData} from "@ayasofyazilim/core-saas/IdentityService";
import {isUnauthorized} from "@repo/utils/policies";
import {isErrorOnRequest} from "@repo/utils/api";
import {getApplicationsApi} from "@repo/actions/core/IdentityService/actions";
import {getResourceData} from "src/language-data/core/IdentityService";
import ApplicationsTable from "./_components/table";

export default async function Page({
  params,
  searchParams,
}: {
  params: {lang: string};
  searchParams: GetApiOpeniddictApplicationsData;
}) {
  const {lang} = params;
  await isUnauthorized({
    requiredPolicies: ["OpenIddictPro.Application"],
    lang,
  });
  const applicationsResponse = await getApplicationsApi(searchParams);
  if (isErrorOnRequest(applicationsResponse, lang)) return;
  const {languageData} = await getResourceData(lang);

  return <ApplicationsTable languageData={languageData} response={applicationsResponse.data} />;
}
