import {FormReadyComponent} from "@repo/ui/form-ready";
import {auth} from "@repo/utils/auth/next-auth";
import {FileText} from "lucide-react";
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
      "ContractService.ContractStore",
      "ContractService.ContractHeaderForMerchant.ContractStoreUpSert",
    ],
    lang,
  });
  const session = await auth();
  const {languageData} = await getResourceData(lang);
  const contractStoresResponse = await getMerchantContractHeadersContractStoresByHeaderIdApi(
    {
      id: contractId,
    },
    session,
  );
  const contractSettingsResponse = await getMerchantContractHeaderContractSettingsByHeaderIdApi(
    {
      id: contractId,
    },
    session,
  );
  const hasSetting =
    contractSettingsResponse.type !== "success" ||
    !contractSettingsResponse.data.items ||
    contractSettingsResponse.data.items.length < 1;

  const hasStore =
    contractStoresResponse.type !== "success" ||
    !contractStoresResponse.data.items ||
    contractStoresResponse.data.items.length < 1;
  return (
    <FormReadyComponent
      active={hasSetting || hasStore}
      content={{
        icon: <FileText className="size-20 text-gray-400" />,
        title: hasSetting
          ? languageData["Missing.ContractSettings.Title"]
          : languageData["Missing.ContractStores.Title"],
        message: hasSetting
          ? languageData["Missing.ContractSettings.Message"]
          : languageData["Missing.ContractStores.Message"],
      }}>
      <ContractStoresTable
        contractSettings={contractSettingsResponse.type === "success" ? contractSettingsResponse.data.items || [] : []}
        contractStores={contractStoresResponse.type === "success" ? contractStoresResponse.data.items || [] : []}
        languageData={languageData}
      />
    </FormReadyComponent>
  );
}
