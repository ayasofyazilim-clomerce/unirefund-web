"use server";

import {isUnauthorized} from "@repo/utils/policies";
import {getClaimTypeDetailsByIdApi} from "src/actions/core/IdentityService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import {getResourceData} from "src/language-data/core/IdentityService";
import {isErrorOnRequest} from "src/utils/page-policy/utils";
import Form from "./_components/form";

export default async function Page({params}: {params: {lang: string; claimTypeId: string}}) {
  const {lang, claimTypeId} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["AbpIdentity.ClaimTypes.Update"],
    lang,
  });

  const claimTypeDetailsResponse = await getClaimTypeDetailsByIdApi(claimTypeId);
  if (isErrorOnRequest(claimTypeDetailsResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={claimTypeDetailsResponse.message} />;
  }

  return (
    <>
      <Form languageData={languageData} response={claimTypeDetailsResponse.data} />
      <div className="hidden" id="page-title">
        {`${languageData.ClaimType} (${claimTypeDetailsResponse.data.name})`}
      </div>
      <div className="hidden" id="page-description">
        {languageData["ClaimType.Update.Description"]}
      </div>
    </>
  );
}
