"use server";

import { isUnauthorized } from "@repo/utils/policies";
import {
  getUserDetailsByIdApi,
  getUsersByIdTwoFactorEnabledApi,
} from "src/actions/core/IdentityService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import { getResourceData } from "src/language-data/core/IdentityService";
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

  const userTwoFactorResponse = await getUsersByIdTwoFactorEnabledApi(userId);
  if (isErrorOnRequest(userTwoFactorResponse, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={userTwoFactorResponse.message}
      />
    );
  }

  return (
    <>
      <Form languageData={languageData} response={userTwoFactorResponse.data} />
      <div className="hidden" id="page-title">
        {`${languageData.User} (${userDetailsResponse.data.userName})`}
      </div>
      <div className="hidden" id="page-description">
        {languageData["User.TwoFactor.Description"]}
      </div>
    </>
  );
}
