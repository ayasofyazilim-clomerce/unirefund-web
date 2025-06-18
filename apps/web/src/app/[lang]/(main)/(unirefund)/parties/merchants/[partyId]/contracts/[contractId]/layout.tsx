"use server";
import {TabLayout} from "@repo/ayasofyazilim-ui/templates/tab-layout";
import {getGrantedPoliciesApi} from "@repo/utils/api";
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
  const grantedPolicies = await getGrantedPoliciesApi();

  const permissions = {
    Contract: await isUnauthorized({
      requiredPolicies: ["ContractService.ContractHeaderForMerchant.Detail"],
      grantedPolicies,
      lang,
      redirect: false,
    }),
    RebateSettings: await isUnauthorized({
      requiredPolicies: ["ContractService.ContractHeaderForMerchant.ViewRebateSetting"],
      grantedPolicies,
      lang,
      redirect: false,
    }),
    Stores: await isUnauthorized({
      requiredPolicies: ["ContractService.ContractHeaderForMerchant.ContractStoreUpSert"],
      redirect: false,
      grantedPolicies,
      lang,
    }),
    Settings: await isUnauthorized({
      requiredPolicies: ["ContractService.ContractHeaderForMerchant.ConractSettingView"],
      redirect: false,
      grantedPolicies,
      lang,
    }),
  };

  const baseLink = getBaseLink(`parties/merchants/${partyId}/contracts/${contractId}/`, lang);
  const tabListItems = [];
  if (!permissions.Contract) {
    tabListItems.push({
      label: languageData["Contracts.Contract"],
      href: `${baseLink}contract`,
    });
  }
  if (!permissions.RebateSettings) {
    tabListItems.push({
      label: languageData["Contracts.RebateSettings"],
      href: `${baseLink}rebate-settings`,
    });
  }
  if (!permissions.Stores) {
    tabListItems.push({
      label: languageData["Contracts.Stores"],
      href: `${baseLink}stores`,
    });
  }
  if (!permissions.Settings) {
    tabListItems.push({
      label: languageData["Contracts.Settings"],
      href: `${baseLink}contract-settings`,
    });
  }
  return <TabLayout tabList={tabListItems}>{children}</TabLayout>;
}
