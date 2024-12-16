import { notFound } from "next/navigation";
import {
  getMerchantContractHeaderContractSettingsByHeaderIdApi,
  getMerchantContractHeadersContractStoresByHeaderIdApi,
} from "src/actions/unirefund/ContractService/action";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { getResourceData } from "src/language-data/unirefund/ContractService";
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
  const contractStores =
    await getMerchantContractHeadersContractStoresByHeaderIdApi({
      id: contractId,
    });
  const contractSettings =
    await getMerchantContractHeaderContractSettingsByHeaderIdApi({
      id: contractId,
    });
  if (
    contractStores.type !== "success" ||
    contractSettings.type !== "success"
  ) {
    return notFound();
  }
  return (
    <ContractStoresTable
      contractSettings={contractSettings.data.items || []}
      contractStores={contractStores.data.items || []}
      languageData={languageData}
    />
  );
}
