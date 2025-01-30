"use server";

import type { GetApiContractServiceRefundFeeHeadersData } from "@ayasofyazilim/saas/ContractService";
import { notFound } from "next/navigation";
import { getResourceData } from "@/language-data/unirefund/ContractService";
import { isUnauthorized } from "@/utils/page-policy/page-policy";
import { getRefundFeeHeadersApi } from "@/actions/unirefund/ContractService/action";
import Table from "./_components/table";

export default async function Page(props: {
  params: { lang: string };
  searchParams: Promise<GetApiContractServiceRefundFeeHeadersData>;
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
      response={response.data.items || []}
    />
  );
}
