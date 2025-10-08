import {auth} from "@repo/utils/auth/next-auth";
import {isUnauthorized} from "@repo/utils/policies";
import {
  getMerchantContractHeaderContractSettingsByHeaderIdApi,
  getMerchantContractHeadersContractStoresByHeaderIdApi,
} from "@repo/actions/unirefund/ContractService/action";
import {getResourceData} from "src/language-data/unirefund/ContractService";
import {ContractStoresTable} from "./_components/table";

export default async function Page({params}: {params: {contractId: string; lang: string}}) {
  const {contractId, lang} = params;
  await isUnauthorized({
    requiredPolicies: [
      "ContractService.ContractHeaderForMerchant.ContractStoreUpSert",
      "ContractService.ContractHeaderForMerchant.ContractStoreUpSert",
    ],
    lang,
  });
  const session = await auth();
  const {languageData} = await getResourceData(lang);
  const contractStoresResponse = await getMerchantContractHeadersContractStoresByHeaderIdApi({id: contractId}, session);
  const contractSettingsResponse = await getMerchantContractHeaderContractSettingsByHeaderIdApi(
    {id: contractId},
    session,
  );
  return (
    <ContractStoresTable
      contractSettings={contractSettingsResponse.type === "success" ? contractSettingsResponse.data.items || [] : []}
      contractStores={contractStoresResponse.type === "success" ? contractStoresResponse.data.items || [] : []}
      languageData={languageData}
    />
  );
}
