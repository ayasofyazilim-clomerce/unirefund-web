"use server";

import type {GetApiContractServiceRefundFeeHeadersData} from "@ayasofyazilim/saas/ContractService";
import {isUnauthorized} from "@repo/utils/policies";
import {auth} from "@repo/utils/auth/next-auth";
import ErrorComponent from "@repo/ui/components/error-component";
import {getRefundFeeHeadersApi} from "@repo/actions/unirefund/ContractService/action";
import {getRefundPointsApi} from "@repo/actions/unirefund/CrmService/actions";
import {getResourceData} from "@/language-data/unirefund/ContractService";
import RefundFees from "./_components/table";

async function getApiRequests(filters: GetApiContractServiceRefundFeeHeadersData) {
  try {
    const session = await auth();
    const apiRequests = await Promise.all([
      getRefundFeeHeadersApi(filters, session),
      getRefundPointsApi({typeCodes: ["HEADQUARTER"]}, session),
    ]);
    return {
      type: "success" as const,
      data: apiRequests,
    };
  } catch (error) {
    const err = error as {data?: string; message?: string};
    return {
      type: "error" as const,
      message: err.message,
    };
  }
}
export default async function Page({
  params,
  searchParams,
}: {
  params: {lang: string};
  searchParams?: GetApiContractServiceRefundFeeHeadersData;
}) {
  const {lang} = params;
  await isUnauthorized({
    requiredPolicies: ["ContractService.RefundFeeHeader", "ContractService.RefundFeeHeader.ViewDetail"],
    lang,
  });
  const {languageData} = await getResourceData(lang);
  const apiRequests = await getApiRequests({
    isTemplate: searchParams?.isTemplate,
    maxResultCount: searchParams?.maxResultCount || 10,
    skipCount: searchParams?.skipCount || 0,
  });
  if (apiRequests.type === "error") {
    return <ErrorComponent languageData={languageData} message={apiRequests.message || "Unknown error occurred"} />;
  }
  const [refundFeeHeadersResponse, refundPointsResponse] = apiRequests.data;
  return (
    <RefundFees
      lang={lang}
      languageData={languageData}
      refundFeeHeaders={refundFeeHeadersResponse.data.items || []}
      refundPoints={refundPointsResponse.data.items || []}
    />
  );
}
