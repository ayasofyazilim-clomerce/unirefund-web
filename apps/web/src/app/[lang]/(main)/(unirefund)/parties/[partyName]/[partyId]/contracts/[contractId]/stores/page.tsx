import { FormReadyComponent } from "@repo/ui/form-ready";
import { FileText } from "lucide-react";
import {
  getMerchantContractHeaderContractSettingsByHeaderIdApi,
  getMerchantContractHeadersContractStoresByHeaderIdApi,
} from "src/actions/unirefund/ContractService/action";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import { getResourceData } from "src/language-data/unirefund/ContractService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import { ContractStoresTable } from "./_components/table";

export default async function Page({
  params,
}: {
  params: { contractId: string; lang: string };
}) {
  const { contractId, lang } = params;
  await isUnauthorized({
    requiredPolicies: [
      "ContractService.ContractStore",
      "ContractService.ContractStore.Edit",
      "ContractService.ContractStore.Delete",
      "ContractService.ContractStore.Create",
    ],
    lang,
  });

  const { languageData } = await getResourceData(lang);

  const contractSettingsResponse =
    await getMerchantContractHeaderContractSettingsByHeaderIdApi({
      id: contractId,
    });
  if (isErrorOnRequest(contractSettingsResponse, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message="contractSettingsResponse.message"
      />
    );
  }

  const contractStoresResponse =
    await getMerchantContractHeadersContractStoresByHeaderIdApi({
      id: contractId,
    });

  return (
    <FormReadyComponent
      active={false}
      content={{
        icon: <FileText className="size-20 text-gray-400" />,
        title: languageData["Missing.ContractStores.Title"],
        message: languageData["Missing.ContractStores.Message"],
      }}
    >
      <ContractStoresTable
        contractSettings={contractSettingsResponse.data.items || []}
        contractStores={contractStoresResponse.data.items || []}
        languageData={languageData}
      />
    </FormReadyComponent>
  );
}
