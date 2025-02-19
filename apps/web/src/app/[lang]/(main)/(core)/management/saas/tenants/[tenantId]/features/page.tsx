"use server";

import {isRedirectError} from "next/dist/client/components/redirect";
import {structuredError} from "@repo/utils/api";
import {auth} from "@repo/utils/auth/next-auth";
import {isUnauthorized} from "@repo/utils/policies";
import {getFeaturesApi} from "src/actions/core/AdministrationService/actions";
import {getTenantDetailsByIdApi} from "src/actions/core/SaasService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import {getResourceData} from "src/language-data/core/SaasService";
import Form from "./_components/form";

async function getApiRequests(tenantId: string) {
  try {
    const session = await auth();
    const requiredRequests = await Promise.all([
      getTenantDetailsByIdApi(tenantId, session),
      getFeaturesApi(
        {
          providerName: "T",
          providerKey: tenantId,
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

export default async function Page({params}: {params: {lang: string; tenantId: string}}) {
  const {lang, tenantId} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["Saas.Tenants.ManageFeatures"],
    lang,
  });

  const apiRequests = await getApiRequests(tenantId);
  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message} />;
  }
  const {requiredRequests} = apiRequests;
  const [tenantDetailsDataResponse, featuresResponse] = requiredRequests;

  return (
    <>
      <Form featuresData={featuresResponse.data} languageData={languageData} />
      <div className="hidden" id="page-title">
        {`${languageData.Tenant} (${tenantDetailsDataResponse.data.name})`}
      </div>
      <div className="hidden" id="page-description">
        {languageData["Tenant.Features.Description"]}
      </div>
    </>
  );
}
