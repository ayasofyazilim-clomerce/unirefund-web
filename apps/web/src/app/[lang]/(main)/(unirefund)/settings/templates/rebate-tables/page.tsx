import {isUnauthorized} from "@repo/utils/policies";
import {getRebateTableHeadersApi} from "@/actions/unirefund/ContractService/action";
import {getResourceData} from "@/language-data/unirefund/ContractService";
import RebateTable from "./_components/table";

export default async function Page({params}: {params: {lang: string; type: string}}) {
  await isUnauthorized({
    requiredPolicies: ["ContractService.RebateTableHeader", "ContractService.RebateTableDetail"],
    lang: params.lang,
  });

  const {languageData} = await getResourceData(params.lang);
  const rebateTableHeadersResponse = await getRebateTableHeadersApi({});
  return (
    <RebateTable lang={params.lang} languageData={languageData} rebateTableHeaders={rebateTableHeadersResponse.data} />
  );
}
