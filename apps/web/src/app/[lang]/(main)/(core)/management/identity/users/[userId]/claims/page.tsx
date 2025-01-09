"use server";

import {
  getAllUserClaimsApi,
  getUserDetailsByIdApi,
  getUsersByIdClaimsApi,
} from "src/actions/core/IdentityService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import { getResourceData } from "src/language-data/core/IdentityService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import Form from "./_components/form";

export default async function Page({
  params,
}: {
  params: { lang: string; userId: string };
}) {
  const { lang, userId } = params;
  const { languageData } = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["AbpIdentity.Users.Update"],
    lang,
  });

  const userDetailsResponse = await getUserDetailsByIdApi(userId);
  if (isErrorOnRequest(userDetailsResponse, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={userDetailsResponse.message}
      />
    );
  }

  const claimsResponse = await getAllUserClaimsApi();
  if (isErrorOnRequest(claimsResponse, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={claimsResponse.message}
      />
    );
  }

  const userClaimsResponse = await getUsersByIdClaimsApi(userId);
  if (isErrorOnRequest(userClaimsResponse, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={userClaimsResponse.message}
      />
    );
  }

  return (
    <>
      <Form
        claimsData={claimsResponse.data}
        languageData={languageData}
        userClaimsData={userClaimsResponse.data}
      />
      <div className="hidden" id="page-title">
        {`${languageData.User} (${userDetailsResponse.data.userName})`}
      </div>
      <div className="hidden" id="page-description">
        {languageData["User.ClaimType.Description"]}
      </div>
    </>
  );
}
