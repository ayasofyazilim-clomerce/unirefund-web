"use server";

import {isUnauthorized} from "@repo/utils/policies";
import {isErrorOnRequest} from "@repo/utils/api";
import ErrorComponent from "@repo/ui/components/error-component";
import {getClaimTypeDetailsByIdApi} from "@repo/actions/core/IdentityService/actions";
import {getResourceData} from "src/language-data/core/IdentityService";
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
