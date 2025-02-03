"use server";

import type { GetApiContractServiceRefundTableHeadersData } from "@ayasofyazilim/saas/ContractService";
import { isUnauthorized } from "@repo/utils/policies";
import { getRefundTableHeadersApi } from "@/actions/unirefund/ContractService/action";
import { getResourceData } from "@/language-data/unirefund/ContractService";
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

  const { languageData } = await getResourceData(props.params.lang);

  return (
    <RefundTable
      languageData={languageData}
      locale={props.params.lang}
      response={response.data.items || []}
    />
  );
}
