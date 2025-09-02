"use server";

import type {
  GetApiRefundServiceRefundsData,
  UniRefund_RefundService_Enums_RefundReconciliationStatus,
  UniRefund_RefundService_Enums_RefundStatus,
  UniRefund_TagService_Tags_Enums_RefundType,
} from "@repo/saas/RefundService";
import {structuredError} from "@repo/utils/api";
import {auth} from "@repo/utils/auth/next-auth";
import {isRedirectError} from "next/dist/client/components/redirect";
import ErrorComponent from "@repo/ui/components/error-component";
import {getRefundApi} from "@repo/actions/unirefund/RefundService/actions";
import {getResourceData} from "src/language-data/unirefund/TagService";
import RefundsTable from "./_components/table";

async function getApiRequests(data: GetApiRefundServiceRefundsData) {
  try {
    const session = await auth();
    const requiredRequests = await Promise.all([getRefundApi(data, session)]);

    const optionalRequests = await Promise.allSettled([]);
    return {requiredRequests, optionalRequests};
  } catch (error) {
    if (!isRedirectError(error)) {
      return structuredError(error);
    }
    throw error;
  }
}

type SearchParamType = GetApiRefundServiceRefundsData & {
  statusesFilterReconciliationStatuses?: string;
  statusesFilterRefundTypes?: string;
  statusesFilterStatuses?: string;
};

export default async function Page({params, searchParams}: {params: {lang: string}; searchParams: SearchParamType}) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);

  const apiRequests = await getApiRequests({
    ...searchParams,
    statusesFilterStatuses: searchParams.statusesFilterStatuses?.split(",") as
      | UniRefund_RefundService_Enums_RefundStatus[]
      | undefined,
    statusesFilterRefundTypes: searchParams.statusesFilterRefundTypes?.split(",") as
      | UniRefund_TagService_Tags_Enums_RefundType[]
      | undefined,
    statusesFilterReconciliationStatuses: searchParams.statusesFilterReconciliationStatuses?.split(",") as
      | UniRefund_RefundService_Enums_RefundReconciliationStatus[]
      | undefined,
    sorting: "paidDate desc",
  });
  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message} />;
  }
  const {requiredRequests} = apiRequests;
  const [refundResponse] = requiredRequests;

  return (
    <div className="p-2shadow-sm mt-6 rounded-lg border border-gray-200 md:p-6">
      <RefundsTable languageData={languageData} locale={lang} response={refundResponse.data} />
    </div>
  );
}
