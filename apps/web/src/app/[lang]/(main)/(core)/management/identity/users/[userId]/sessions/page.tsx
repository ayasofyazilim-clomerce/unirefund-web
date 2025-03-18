"use server";

import type {GetApiIdentitySessionsData} from "@ayasofyazilim/core-saas/IdentityService";
import {isUnauthorized} from "@repo/utils/policies";
import {isErrorOnRequest} from "@repo/utils/api";
import ErrorComponent from "@repo/ui/components/error-component";
import {getSessionsApi, getUserDetailsByIdApi} from "@repo/actions/core/IdentityService/actions";
import {getResourceData} from "src/language-data/core/IdentityService";
import SessionsTable from "./_components/table";

export default async function Page({
  params,
  searchParams,
}: {
  params: {lang: string; userId: string};
  searchParams: GetApiIdentitySessionsData;
}) {
  const {lang, userId} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["AbpIdentity.Users"],
    lang,
  });

  const userDetailsResponse = await getUserDetailsByIdApi(userId);
  if (isErrorOnRequest(userDetailsResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={userDetailsResponse.message} />;
  }

  const userSessionsResponse = await getSessionsApi({
    ...searchParams,
    userId,
  });
  if (isErrorOnRequest(userSessionsResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={userSessionsResponse.message} />;
  }

  return (
    <>
      <SessionsTable languageData={languageData} response={userSessionsResponse.data} />
      <div className="hidden" id="page-title">
        {`${languageData.User} (${userDetailsResponse.data.userName})`}
      </div>
      <div className="hidden" id="page-description">
        {languageData["User.Session.Description"]}
      </div>
    </>
  );
}
