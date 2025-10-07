"use server";

import {getMerchantByIdApi} from "@repo/actions/unirefund/CrmService/actions";
import {TabLayout} from "@repo/ayasofyazilim-ui/templates/tab-layout";
import ErrorComponent from "@repo/ui/components/error-component";
import {getGrantedPoliciesApi, structuredError} from "@repo/utils/api";
import {auth} from "@repo/utils/auth/next-auth";
import {isUnauthorized} from "@repo/utils/policies";
import {isRedirectError} from "next/dist/client/components/redirect";
import {getResourceData} from "src/language-data/unirefund/CRMService";
import {getBaseLink} from "src/utils";
import PartyHeader from "../../_components/party-header";

async function getApiRequests({partyId}: {partyId: string}) {
  try {
    const session = await auth();
    const requiredRequests = await Promise.all([getMerchantByIdApi(partyId, session), getGrantedPoliciesApi()]);
    const optionalRequests = await Promise.allSettled([]);
    return {requiredRequests, optionalRequests};
  } catch (error) {
    if (!isRedirectError(error)) {
      return structuredError(error);
    }
    throw error;
  }
}
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    partyId: string;
    lang: string;
  };
}) {
  const {partyId, lang} = params;
  const {languageData} = await getResourceData(lang);

  const baseLink = getBaseLink(`parties/merchants/${partyId}/`, lang);
  const apiRequests = await getApiRequests({partyId});

  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message} />;
  }
  const [merchantDetailResponse, grantedPolicies] = apiRequests.requiredRequests;
  const isHeadquarter = merchantDetailResponse.data.typeCode === "HEADQUARTER";

  const isAffiliationsAvailable =
    grantedPolicies &&
    !(await isUnauthorized({
      requiredPolicies: ["CRMService.Merchants.ViewAffiliationList", "AbpIdentity.Roles"],
      grantedPolicies,
      lang,
      redirect: false,
    }));
  const isStoreAvailable =
    isHeadquarter &&
    !(await isUnauthorized({
      requiredPolicies: ["CRMService.Merchants.ViewStoreList"],
      grantedPolicies,
      lang,
      redirect: false,
    }));
  const isContractsAvailable =
    isHeadquarter &&
    !(await isUnauthorized({
      requiredPolicies: [
        "ContractService.ContractHeaderForMerchant",
        "ContractService.ContractHeaderForMerchant.GetListDetailByMerchantId",
      ],
      grantedPolicies,
      lang,
      redirect: false,
    }));
  const isProductGroupsAvailable =
    isHeadquarter &&
    !(await isUnauthorized({
      requiredPolicies: ["SettingService.ProductGroupMerchants"],
      grantedPolicies,
      lang,
      redirect: false,
    }));
  const tabListItems = [
    {
      label: languageData["CRM.Details"],
      href: `${baseLink}details`,
    },
  ];
  if (isStoreAvailable) {
    tabListItems.push({
      label: languageData["CRM.Merchant.SubOrganization"],
      href: `${baseLink}sub-stores`,
    });
  }
  if (isProductGroupsAvailable) {
    tabListItems.push({
      label: languageData["CRM.ProductGroups"],
      href: `${baseLink}product-groups`,
    });
  }
  if (isAffiliationsAvailable) {
    tabListItems.push({
      label: languageData["CRM.Affiliations"],
      href: `${baseLink}affiliations`,
    });
  }
  if (isContractsAvailable) {
    tabListItems.push({
      label: languageData["CRM.Contracts"],
      href: `${baseLink}contracts`,
    });
  }
  return (
    <>
      <PartyHeader details={merchantDetailResponse.data} partyType="merchants" />
      <TabLayout
        classNames={{
          vertical: {
            tabs: "overflow-hidden",
            tabContent: "overflow-hidden",
          },
        }}
        orientation="vertical"
        tabList={tabListItems}
        variant="simple">
        {children}
      </TabLayout>
    </>
  );
}
