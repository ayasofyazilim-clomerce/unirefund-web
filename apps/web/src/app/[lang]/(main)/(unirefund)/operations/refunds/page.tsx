"use server";

import type {
  UniRefund_RefundService_Enums_RefundReconciliationStatus,
  UniRefund_RefundService_Enums_RefundStatus,
  UniRefund_TagService_Tags_Enums_RefundType,
} from "@ayasofyazilim/saas/RefundService";
import {isUnauthorized} from "@repo/utils/policies";
import {getRefundApi} from "src/actions/unirefund/RefundService/actions";
import {getResourceData} from "src/language-data/unirefund/TagService";
import {isErrorOnRequest} from "src/utils/page-policy/utils";
import ErrorComponent from "../../../_components/error-component";
import RefundsTable from "./table";

interface SearchParamType {
  maxResultCount?: number;
  skipCount?: number;
  sorting?: string;
  statusesFilterReconciliationStatuses?: string;
  statusesFilterRefundTypes?: string;
  statusesFilterStatuses?: string;
  timeFilterEndDate?: string;
  timeFilterStartDate?: string;
}

export default async function Page({params, searchParams}: {params: {lang: string}; searchParams: SearchParamType}) {
  const {lang} = params;

  await isUnauthorized({
    requiredPolicies: ["RefundService.Refunds"],
    lang,
  });

  const response = await getRefundApi({
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

  const {languageData} = await getResourceData(lang);

  if (isErrorOnRequest(response, lang, false)) {
    return <ErrorComponent languageData={languageData} message={response.message} />;
  }

  return <RefundsTable languageData={languageData} locale={lang} response={response.data} />;
}
