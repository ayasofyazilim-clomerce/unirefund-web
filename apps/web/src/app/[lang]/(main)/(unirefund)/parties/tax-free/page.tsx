"use server";

import type {GetApiCrmServiceTaxFreesData} from "@ayasofyazilim/saas/CRMService";
import {getTaxFreesApi} from "@repo/actions/unirefund/CrmService/actions";
import ErrorComponent from "@repo/ui/components/error-component";
import {structuredError} from "@repo/utils/api";
import {auth} from "@repo/utils/auth/next-auth";
import {isRedirectError} from "next/dist/client/components/redirect";
import {getResourceData} from "src/language-data/unirefund/CRMService";
import TaxFreesTable from "./_components/table";

interface SearchParamType {
  ids?: string;
  name?: string;
  maxResultCount?: number;
  skipCount?: number;
  sorting?: string;
  typeCode?: string;
}

async function getApiRequests(filters: GetApiCrmServiceTaxFreesData) {
  try {
    const session = await auth();
    const requiredRequests = await Promise.all([getTaxFreesApi(filters, session)]);
    const optionalRequests = await Promise.allSettled([]);
    return {requiredRequests, optionalRequests};
  } catch (error) {
    if (!isRedirectError(error)) {
      return structuredError(error);
    }
    throw error;
  }
}

export default async function Page({params, searchParams}: {params: {lang: string}; searchParams?: SearchParamType}) {
  const {lang} = params;
  // await isUnauthorized({
  //   requiredPolicies: ["CRMService.TaxFrees"],
  //   lang,
  // });
  const {languageData} = await getResourceData(lang);

  const apiRequests = await getApiRequests({
    typeCodes: searchParams?.typeCode?.split(",") || [],
    name: searchParams?.name || "",
    maxResultCount: searchParams?.maxResultCount || 10,
    skipCount: searchParams?.skipCount || 0,
  } as GetApiCrmServiceTaxFreesData);

  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message} />;
  }
  const [taxFreeResponse] = apiRequests.requiredRequests;

  return (
    <div className="mt-6 rounded-lg border border-gray-200 p-6">
      <TaxFreesTable languageData={languageData} newLink="refund-points/new" taxFrees={taxFreeResponse.data} />
    </div>
  );
}
