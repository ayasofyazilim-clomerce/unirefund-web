"use server";

import type { GetApiContractServiceRefundTableHeadersData } from "@ayasofyazilim/saas/ContractService";
import { notFound } from "next/navigation";
import { getResourceData } from "@/language-data/unirefund/ContractService";
import { isUnauthorized } from "@/utils/page-policy/page-policy";
import { getRefundTableHeadersApi } from "@/actions/unirefund/ContractService/action";
import RefundTable from "./_components/table";

export default async function Page(props: {
  params: { lang: string };
  searchParams: Promise<GetApiContractServiceRefundTableHeadersData>;
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
      response={response.data.items || []}
    />
  );
}
