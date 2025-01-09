"use server";

import { getTenantDetailsByIdApi } from "src/actions/core/SaasService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import { getResourceData } from "src/language-data/core/SaasService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import Form from "./_components/form";

export default async function Page({
  params,
}: {
  params: { lang: string; tenantId: string };
}) {
  const { lang, tenantId } = params;
  const { languageData } = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["Saas.Tenants.SetPassword"],
    lang,
  });

  const tenantDetailsDataResponse = await getTenantDetailsByIdApi(tenantId);
  if (isErrorOnRequest(tenantDetailsDataResponse, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={tenantDetailsDataResponse.message}
      />
    );
  }

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
