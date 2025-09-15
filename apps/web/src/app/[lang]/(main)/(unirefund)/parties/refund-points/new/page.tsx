"use server";

import ErrorComponent from "@repo/ui/components/error-component";
import {structuredError} from "@repo/utils/api";
import {auth} from "@repo/utils/auth/next-auth";
import {isRedirectError} from "next/dist/client/components/redirect";
import {isUnauthorized} from "@repo/utils/policies";
import {getTaxOfficesApi} from "@repo/actions/unirefund/CrmService/actions";
import {getResourceData} from "src/language-data/unirefund/CRMService";
import CreateRefundPointForm from "../_components/create-form";

async function getApiRequests() {
  try {
    const session = await auth();
    const requiredRequests = await Promise.all([]);
    const optionalRequests = await Promise.allSettled([getTaxOfficesApi({}, session)]);
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
}: {
  params: {
    lang: string;
  };
}) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["CRMService.RefundPoints.Create"],
    lang,
  });

  const apiRequests = await getApiRequests();
  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message} />;
  }

  const [taxOfficeResponse] = apiRequests.optionalRequests;

  const taxOfficeList = taxOfficeResponse.status === "fulfilled" ? taxOfficeResponse.value.data.items || [] : [];
  return <CreateRefundPointForm languageData={languageData} taxOfficeList={taxOfficeList} />;
}
