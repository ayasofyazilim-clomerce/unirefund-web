"use server";

import ErrorComponent from "@repo/ui/components/error-component";
import {structuredError} from "@repo/utils/api";
import {auth} from "@repo/utils/auth/next-auth";
import {isUnauthorized} from "@repo/utils/policies";
import {getAllEditionsApi, getEditionDetailsByIdApi} from "@repo/actions/core/SaasService/actions";
import {getResourceData} from "src/language-data/core/SaasService";
import Form from "./_components/form";

async function getApiRequests(editionId: string) {
  try {
    const session = await auth();
    const requiredRequests = await Promise.all([
      getAllEditionsApi(session),
      getEditionDetailsByIdApi(editionId, session),
    ]);
    const optionalRequests = await Promise.allSettled([]);
    return {requiredRequests, optionalRequests};
  } catch (error) {
    return structuredError(error);
  }
}
export default async function Page({params}: {params: {lang: string; editionId: string}}) {
  const {lang, editionId} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["Saas.Editions.Update"],
    lang,
  });

  const apiRequests = await getApiRequests(editionId);
  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message} />;
  }
  const {requiredRequests} = apiRequests;
  const [editionsResponse, editionDetailsResponse] = requiredRequests;

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
