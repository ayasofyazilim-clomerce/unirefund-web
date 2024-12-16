import { notFound } from "next/navigation";
import {
  getMerchantContractHeaderByIdApi,
  getMerchantContractHeaderContractSettingsByHeaderIdApi,
  getRefundTableHeadersApi,
} from "src/actions/unirefund/ContractService/action";
import { getAdressesApi } from "src/actions/unirefund/CrmService/actions";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { getResourceData } from "src/language-data/unirefund/ContractService";
import { ContractSettings } from "./_components/contract-settings";

export default async function Page({
  params,
}: {
  params: {
    lang: string;
    partyId: string;
    contractId: string;
    partyName: "merchants";
  };
}) {
  const { lang, contractId, partyId, partyName } = params;
  await isUnauthorized({
    requiredPolicies: ["ContractService.ContractSetting.Edit"],
    lang,
  });

  const { languageData } = await getResourceData(lang);
  const contractSettings =
    await getMerchantContractHeaderContractSettingsByHeaderIdApi({
      id: contractId,
    });
  const refundTableHeaders = await getRefundTableHeadersApi({});
  const contractHeaderDetails =
    await getMerchantContractHeaderByIdApi(contractId);
  const addressList = await getAdressesApi(partyId, partyName);
  if (
    contractSettings.type !== "success" ||
    refundTableHeaders.type !== "success" ||
    contractHeaderDetails.type !== "success" ||
    addressList.type !== "success"
  )
    return notFound();
  return (
    <ContractSettings
      addressList={addressList.data}
      contractHeaderDetails={contractHeaderDetails.data}
      contractSettings={contractSettings.data}
      lang={lang}
      languageData={languageData}
    />
  );
}
