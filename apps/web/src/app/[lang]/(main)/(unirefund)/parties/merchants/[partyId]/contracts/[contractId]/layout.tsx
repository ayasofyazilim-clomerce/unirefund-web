"use server";
import {TabLayout} from "@repo/ayasofyazilim-ui/templates/tab-layout";
import {isUnauthorized} from "@repo/utils/policies";
import {getResourceData} from "src/language-data/unirefund/ContractService";
import {getBaseLink} from "src/utils";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    lang: string;
    contractId: string;
    partyId: string;
  };
}) {
  const {lang, contractId, partyId} = params;
  const {languageData} = await getResourceData(lang);

  await isUnauthorized({
    requiredPolicies: [
      "ContractService.ContractHeaderForMerchant",
      "ContractService.ContractHeaderForMerchant.Edit",
      "ContractService.ContractHeaderForMerchant.UpSertRebateSetting",
      "ContractService.ContractHeaderForMerchant.ContractStoreUpSert",
      "ContractService.ContractHeaderForMerchant.ContractSettingEdit",
    ],
    lang,
  });
  const baseLink = getBaseLink(`parties/merchants/${partyId}/contracts/${contractId}/`, lang);
  return (
    <TabLayout
      tabList={[
        {
          label: languageData["Contracts.Contract"],
          href: `${baseLink}contract`,
        },
        {
          label: languageData["Contracts.RebateSettings"],
          href: `${baseLink}rebate-settings`,
        },
        {
          label: languageData["Contracts.Stores"],
          href: `${baseLink}stores`,
        },
        {
          label: languageData["Contracts.Settings"],
          href: `${baseLink}contract-settings`,
        },
      ]}>
      {children}
    </TabLayout>
  );
}
