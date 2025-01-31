"use server";
import { TabLayout } from "@repo/ayasofyazilim-ui/templates/tab-layout";
import { getResourceData } from "src/language-data/unirefund/ContractService";
import { getBaseLink } from "src/utils";
import { isUnauthorized } from "src/utils/page-policy/page-policy";

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
  const { lang, contractId, partyId } = params;
  const { languageData } = await getResourceData(lang);

  await isUnauthorized({
    requiredPolicies: [
      "ContractService.ContractHeaderForMerchant",
      "ContractService.ContractSetting.Edit",
      "ContractService.RebateSetting.Edit",
      "ContractService.ContractHeaderForMerchant.Edit",
    ],
    lang,
  });
  const baseLink = getBaseLink(
    `parties/merchants/${partyId}/contracts/${contractId}/`,
    lang,
  );
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
          label: languageData["Contracts.ContractSettings"],
          href: `${baseLink}contract-settings`,
        },
      ]}
    >
      {children}
    </TabLayout>
  );
}
