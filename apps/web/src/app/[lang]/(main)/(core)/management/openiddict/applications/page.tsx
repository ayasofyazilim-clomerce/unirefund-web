"use server";

import type {GetApiOpeniddictApplicationsData} from "@ayasofyazilim/saas/IdentityService";
import {isUnauthorized} from "@repo/utils/policies";
import {getApplicationsApi} from "src/actions/core/IdentityService/actions";
import {getResourceData} from "src/language-data/core/IdentityService";
import {isErrorOnRequest} from "src/utils/page-policy/utils";
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
