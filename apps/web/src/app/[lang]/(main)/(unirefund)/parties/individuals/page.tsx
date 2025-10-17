"use server";

import {getIndividualsByAffiliationsApi} from "@repo/actions/unirefund/CrmService/actions";
import type {GetApiCrmServiceIndividualsByAffiliationsData} from "@repo/saas/CRMService";
import ErrorComponent from "@repo/ui/components/error-component";
import {structuredError} from "@repo/utils/api";
import {auth} from "@repo/utils/auth/next-auth";
import {isRedirectError} from "next/dist/client/components/redirect";
import {getResourceData} from "src/language-data/unirefund/CRMService";
import IndividualsTable from "./_components/table";

async function getApiRequests(filters: GetApiCrmServiceIndividualsByAffiliationsData) {
  try {
    const session = await auth();
    const requiredRequests = await Promise.all([getIndividualsByAffiliationsApi(filters, session)]);
    const optionalRequests = await Promise.allSettled([]);
    return {requiredRequests, optionalRequests};
  } catch (error) {
    if (!isRedirectError(error)) {
      return structuredError(error);
    }
    throw error;
  }
}

export default async function Page({
  params,
  searchParams,
}: {
  params: {lang: string};
  searchParams?: GetApiCrmServiceIndividualsByAffiliationsData;
}) {
  const {lang} = params;

  const {languageData} = await getResourceData(lang);

  const apiRequests = await getApiRequests(searchParams || {});

  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message} />;
  }
  const [individualResponse] = apiRequests.requiredRequests;

  return (
    <div className="mt-6 rounded-lg border border-gray-200 p-2 md:p-6">
      <IndividualsTable individuals={individualResponse.data} languageData={languageData} newLink="individuals/new" />
    </div>
  );
}
