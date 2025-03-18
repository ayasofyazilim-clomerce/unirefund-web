"use server";

import ErrorComponent from "@repo/ui/components/error-component";
import {getTenantDetailsByIdApi} from "@repo/actions/core/SaasService/actions";
import {structuredError} from "@repo/utils/api";
import {auth} from "@repo/utils/auth/next-auth";
import {isUnauthorized} from "@repo/utils/policies";
import {getResourceData} from "src/language-data/core/SaasService";
import Form from "./_components/form";

async function getApiRequests(tenantId: string) {
  try {
    const session = await auth();
    const requiredRequests = await Promise.all([getTenantDetailsByIdApi(tenantId, session)]);
    const optionalRequests = await Promise.allSettled([]);
    return {requiredRequests, optionalRequests};
  } catch (error) {
    return structuredError(error);
  }
}
export default async function Page({params}: {params: {lang: string; tenantId: string}}) {
  const {lang, tenantId} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["Saas.Tenants.SetPassword"],
    lang,
  });

  const apiRequests = await getApiRequests(tenantId);
  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message} />;
  }
  const {requiredRequests} = apiRequests;
  const [tenantDetailsDataResponse] = requiredRequests;

  return (
    <>
      <Form languageData={languageData} />
      <div className="hidden" id="page-title">
        {`${languageData.Tenant} (${tenantDetailsDataResponse.data.name})`}
      </div>
      <div className="hidden" id="page-description">
        {languageData["Tenant.SetPassword.Description"]}
      </div>
    </>
  );
}
