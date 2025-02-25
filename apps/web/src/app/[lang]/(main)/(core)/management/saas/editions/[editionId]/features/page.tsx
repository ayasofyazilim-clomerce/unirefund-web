"use server";

import {structuredError} from "@repo/utils/api";
import {auth} from "@repo/utils/auth/next-auth";
import {isUnauthorized} from "@repo/utils/policies";
import ErrorComponent from "@repo/ui/components/error-component";
import {isRedirectError} from "next/dist/client/components/redirect";
import {getFeaturesApi} from "src/actions/core/AdministrationService/actions";
import {getEditionDetailsByIdApi} from "src/actions/core/SaasService/actions";
import {getResourceData} from "src/language-data/core/SaasService";
import Form from "./_components/form";

async function getApiRequests(editionId: string) {
  try {
    const session = await auth();
    const requiredRequests = await Promise.all([
      getEditionDetailsByIdApi(editionId, session),
      getFeaturesApi(
        {
          providerName: "E",
          providerKey: editionId,
        },
        session,
      ),
    ]);

    const optionalRequests = await Promise.allSettled([]);
    return {requiredRequests, optionalRequests};
  } catch (error) {
    if (!isRedirectError(error)) {
      return structuredError(error);
    }
    throw error;
  }
}
export default async function Page({params}: {params: {lang: string; editionId: string}}) {
  const {lang, editionId} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["Saas.Editions.ManageFeatures"],
    lang,
  });

  const apiRequests = await getApiRequests(editionId);
  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message} />;
  }
  const {requiredRequests} = apiRequests;
  const [editionDetailsResponse, featuresResponse] = requiredRequests;

  return (
    <>
      <Form featuresData={featuresResponse.data} languageData={languageData} />
      <div className="hidden" id="page-title">
        {`${languageData.Edition} (${editionDetailsResponse.data.displayName})`}
      </div>
      <div className="hidden" id="page-description">
        {languageData["Edition.Features.Description"]}
      </div>
    </>
  );
}
