"use server";

import type { GetApiRefundServiceRefundsData } from "@ayasofyazilim/saas/RefundService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import { getResourceData } from "src/language-data/unirefund/ContractService";
import { getRefundApi } from "src/actions/unirefund/RefundService/actions";
import RefundTable from "./table";

export default async function Page(props: {
  params: { lang: string };
  searchParams?: Promise<GetApiRefundServiceRefundsData>;
}) {
  await isUnauthorized({
    requiredPolicies: ["RefundService.Refunds"],
    lang: props.params.lang,
  });

  const searchParams = await props.searchParams;

  const response = await getRefundApi(searchParams);
  if (isErrorOnRequest(response, props.params.lang)) return;

  const { languageData } = await getResourceData(props.params.lang);

  return (
    <RefundTable
      languageData={languageData}
      locale={props.params.lang}
      response={response.data}
    />
  );
}
