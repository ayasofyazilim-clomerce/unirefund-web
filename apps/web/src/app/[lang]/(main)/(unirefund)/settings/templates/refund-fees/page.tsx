"use server";

import type { GetApiContractServiceRefundTablesRefundFeeHeadersData } from "@ayasofyazilim/saas/ContractService";
import { notFound } from "next/navigation";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { getResourceData } from "src/language-data/unirefund/ContractService";
import { getRefundFeeHeadersApi } from "../../../../../../../actions/unirefund/ContractService/action";
import Table from "./table";

export default async function Page(props: {
  params: { lang: string };
  searchParams: Promise<GetApiContractServiceRefundTablesRefundFeeHeadersData>;
}) {
  await isUnauthorized({
    requiredPolicies: [
      "ContractService.RefundFeeHeader",
      "ContractService.RefundFeeDetail",
    ],
    lang: props.params.lang,
  });

  const searchParams = await props.searchParams;
  const response = await getRefundFeeHeadersApi(searchParams);
  if (response.type !== "success") return notFound();

  const { languageData } = await getResourceData(props.params.lang);

  return (
    <Table
      languageData={languageData}
      locale={props.params.lang}
      response={response.data}
    />
  );
}
