"use server";

import type {GetApiContractServiceRefundTableHeadersData} from "@ayasofyazilim/saas/ContractService";
import {isUnauthorized} from "@repo/utils/policies";
import {auth} from "@repo/utils/auth/next-auth";
import ErrorComponent from "@repo/ui/components/error-component";
import {getRefundTableHeadersApi} from "@repo/actions/unirefund/ContractService/action";
import {getMerchantsApi} from "@repo/actions/unirefund/CrmService/actions";
import {getResourceData} from "@/language-data/unirefund/ContractService";
import RefundTable from "./_components/table";

async function getApiRequests(filters: GetApiContractServiceRefundTableHeadersData) {
  try {
    const session = await auth();
    const apiRequests = await Promise.all([
      getRefundTableHeadersApi(filters, session),
      getMerchantsApi({typeCodes: ["HEADQUARTER"]}, session),
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
  searchParams?: GetApiContractServiceRefundTableHeadersData;
}) {
  const {lang} = params;
  await isUnauthorized({
    requiredPolicies: ["ContractService.RefundTableHeader", "ContractService.RefundTableHeader.ViewDetail"],
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
  const [refundTableHeadersResponse, merchantResponse] = apiRequests.data;
  return (
    <RefundTable
      lang={lang}
      languageData={languageData}
      merchants={merchantResponse.data.items || []}
      refundTableHeaders={refundTableHeadersResponse.data}
    />
  );
}
