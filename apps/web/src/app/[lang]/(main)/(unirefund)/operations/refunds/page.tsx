"use server";

import type {
  UniRefund_RefundService_Enums_RefundReconciliationStatus,
  UniRefund_RefundService_Enums_RefundStatus,
  UniRefund_TagService_Tags_RefundType,
} from "@ayasofyazilim/saas/RefundService";
import { getRefundApi } from "src/actions/unirefund/RefundService/actions";
import { getResourceData } from "src/language-data/unirefund/TagService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
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

export default async function Page(props: {
  params: { lang: string };
  searchParams: SearchParamType;
}) {
  await isUnauthorized({
    requiredPolicies: ["RefundService.Refunds"],
    lang: props.params.lang,
  });

  const searchParams = props.searchParams;
  const response = await getRefundApi({
    ...searchParams,
    statusesFilterStatuses: searchParams.statusesFilterStatuses?.split(",") as
      | UniRefund_RefundService_Enums_RefundStatus[]
      | undefined,
    statusesFilterRefundTypes: searchParams.statusesFilterRefundTypes?.split(
      ",",
    ) as UniRefund_TagService_Tags_RefundType[] | undefined,
    statusesFilterReconciliationStatuses:
      searchParams.statusesFilterReconciliationStatuses?.split(",") as
        | UniRefund_RefundService_Enums_RefundReconciliationStatus[]
        | undefined,
  });
  if (isErrorOnRequest(response, props.params.lang)) return;

  const { languageData } = await getResourceData(props.params.lang);

  return (
    <RefundsTable
      languageData={languageData}
      locale={props.params.lang}
      response={response.data}
    />
  );
}
