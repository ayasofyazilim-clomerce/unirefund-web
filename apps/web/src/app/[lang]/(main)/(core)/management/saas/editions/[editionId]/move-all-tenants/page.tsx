"use server";

import {isUnauthorized} from "@repo/utils/policies";
import {getAllEditionsApi, getEditionDetailsByIdApi} from "src/actions/core/SaasService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import {getResourceData} from "src/language-data/core/SaasService";
import {isErrorOnRequest} from "src/utils/page-policy/utils";
import Form from "./_components/form";

export default async function Page({params}: {params: {lang: string; editionId: string}}) {
  const {lang, editionId} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["Saas.Editions.Update"],
    lang,
  });

  const editionsResponse = await getAllEditionsApi();
  if (isErrorOnRequest(editionsResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={editionsResponse.message} />;
  }
  const editionDetailsResponse = await getEditionDetailsByIdApi(editionId);
  if (isErrorOnRequest(editionDetailsResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={editionDetailsResponse.message} />;
  }
  return (
    <>
      <Form editionList={editionsResponse.data} languageData={languageData} />
      <div className="hidden" id="page-title">
        {`${languageData.Edition} (${editionDetailsResponse.data.displayName})`}
      </div>
      <div className="hidden" id="page-description">
        {languageData["Edition.MoveAllTenants.Description"]}
      </div>
    </>
  );
}
