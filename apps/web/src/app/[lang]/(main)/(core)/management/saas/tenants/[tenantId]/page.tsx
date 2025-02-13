"use server";

import {isUnauthorized} from "@repo/utils/policies";
import {isErrorOnRequest} from "@repo/utils/api";
import {getAllEditionsApi, getTenantDetailsByIdApi} from "src/actions/core/SaasService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import {getResourceData} from "src/language-data/core/SaasService";
import Form from "./_components/form";

export default async function Page({params}: {params: {lang: string; tenantId: string}}) {
  const {lang, tenantId} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["Saas.Tenants.Update"],
    lang,
  });

  const editionsResponse = await getAllEditionsApi();
  if (isErrorOnRequest(editionsResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={editionsResponse.message} />;
  }

  const tenantDetailsDataResponse = await getTenantDetailsByIdApi(tenantId);
  if (isErrorOnRequest(tenantDetailsDataResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={tenantDetailsDataResponse.message} />;
  }

  return (
    <>
      <Form
        editionList={editionsResponse.data}
        languageData={languageData}
        tenantDetailsData={tenantDetailsDataResponse.data}
      />
      <div className="hidden" id="page-title">
        {`${languageData.Tenant} (${tenantDetailsDataResponse.data.name})`}
      </div>
      <div className="hidden" id="page-description">
        {languageData["Tenant.Update.Description"]}
      </div>
    </>
  );
}
