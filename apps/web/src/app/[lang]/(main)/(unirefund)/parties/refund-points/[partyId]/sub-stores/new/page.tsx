"use server";

import {getRefundPointByIdApi, getTaxOfficesApi} from "@repo/actions/unirefund/CrmService/actions";
import ErrorComponent from "@repo/ui/components/error-component";
import {structuredError} from "@repo/utils/api";
import {auth} from "@repo/utils/auth/next-auth";
import {isRedirectError} from "next/dist/client/components/redirect";
import {isUnauthorized} from "@repo/utils/policies";
import {getResourceData} from "src/language-data/unirefund/CRMService";
import CreateSubRefundPointForm from "../../../_components/create-form";

async function getApiRequests(partyId: string) {
  try {
    const session = await auth();
    const requiredRequests = await Promise.all([getRefundPointByIdApi(partyId)]);
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
    partyId: string;
  };
}) {
  const {lang, partyId} = params;
  const {languageData} = await getResourceData(lang);

  await isUnauthorized({
    requiredPolicies: ["CRMService.RefundPoints.Create"],
    lang,
  });

  const apiRequests = await getApiRequests(partyId);
  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message} />;
  }

  const [refundPointResponse] = apiRequests.requiredRequests;
  const [taxOfficeResponse] = apiRequests.optionalRequests;

  const taxOfficeList = taxOfficeResponse.status === "fulfilled" ? taxOfficeResponse.value.data.items || [] : [];
  return (
    <CreateSubRefundPointForm
      formData={{
        name: " ",
        typeCode: "REFUNDPOINT",
        parentId: partyId,
      }}
      languageData={languageData}
      parentDetails={refundPointResponse.data}
      taxOfficeList={taxOfficeList}
      typeCode="REFUNDPOINT"
    />
  );
}
