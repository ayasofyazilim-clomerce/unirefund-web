import { notFound } from "next/navigation";
import { getRebateTableHeadersApi } from "src/actions/unirefund/ContractService/action";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { getResourceData } from "src/language-data/unirefund/ContractService";
import RebateTable from "./table";

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
  const templates = await getRebateTableHeadersApi({});
  if (templates.type !== "success") return notFound();
  return (
    <RebateTable
      lang={params.lang}
      languageData={languageData}
      templates={templates.data}
    />
  );
}
