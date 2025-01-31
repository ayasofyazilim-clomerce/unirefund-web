import { notFound } from "next/navigation";
import { getRebateTableHeadersApi } from "@/actions/unirefund/ContractService/action";
import { isUnauthorized } from "@/utils/page-policy/page-policy";
import { getResourceData } from "@/language-data/unirefund/ContractService";
import RebateTable from "./_components/table";

export default async function Page({
  params,
}: {
  params: { lang: string; type: string };
}) {
  await isUnauthorized({
    requiredPolicies: [
      "ContractService.RebateTableHeader",
      "ContractService.RebateTableDetail",
    ],
    lang: params.lang,
  });

  const { languageData } = await getResourceData(params.lang);
  const rebateTableHeadersResponse = await getRebateTableHeadersApi({});
  if (rebateTableHeadersResponse.type !== "success") return notFound();
  return (
    <RebateTable
      lang={params.lang}
      languageData={languageData}
      rebateTableHeaders={rebateTableHeadersResponse.data}
    />
  );
}
