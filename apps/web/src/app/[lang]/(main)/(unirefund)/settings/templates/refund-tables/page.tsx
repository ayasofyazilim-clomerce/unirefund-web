"use server";

import type { GetApiContractServiceRefundTablesRefundTableHeadersData } from "@ayasofyazilim/saas/ContractService";
import { notFound } from "next/navigation";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { getResourceData } from "src/language-data/unirefund/ContractService";
import { getRefundTableHeadersApi } from "../../../../../../../actions/unirefund/ContractService/action";
import RefundTable from "./table";

export default async function Page(props: {
  params: { lang: string };
  searchParams: Promise<GetApiContractServiceRefundTablesRefundTableHeadersData>;
}) {
  await isUnauthorized({
    requiredPolicies: [
      "ContractService.RefundTableHeader",
      "ContractService.RefundTableDetail",
    ],
    lang: props.params.lang,
  });

  const searchParams = await props.searchParams;
  const response = await getRefundTableHeadersApi(searchParams);
  if (response.type !== "success") return notFound();

  const { languageData } = await getResourceData(props.params.lang);

  return (
    <RefundTable
      languageData={languageData}
      locale={props.params.lang}
      response={response.data}
    />
  );
}
