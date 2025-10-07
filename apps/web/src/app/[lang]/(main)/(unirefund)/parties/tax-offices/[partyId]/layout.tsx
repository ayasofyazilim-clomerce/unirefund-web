"use server";

import {getTaxOfficeByIdApi} from "@repo/actions/unirefund/CrmService/actions";
import {TabLayout} from "@repo/ayasofyazilim-ui/templates/tab-layout";
import ErrorComponent from "@repo/ui/components/error-component";
import {auth} from "@repo/utils/auth/next-auth";
import {isRedirectError} from "next/dist/client/components/redirect";
import {getGrantedPoliciesApi, structuredError} from "@repo/utils/api";
import {isUnauthorized} from "@repo/utils/policies";
import {getResourceData} from "src/language-data/unirefund/CRMService";
import {getBaseLink} from "src/utils";
import PartyHeader from "../../_components/party-header";

async function getApiRequests({partyId}: {partyId: string}) {
  try {
    const session = await auth();
    const requiredRequests = await Promise.all([getTaxOfficeByIdApi(partyId, session), getGrantedPoliciesApi()]);
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
  const baseLink = getBaseLink(`parties/tax-offices/${partyId}/`, lang);

  const apiRequests = await getApiRequests({partyId});

  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message} />;
  }
  const [taxFreeDetailResponse, grantedPolicies] = apiRequests.requiredRequests;
  // const isHeadquarter = taxFreeDetailResponse.data.typeCode === "HEADQUARTER";

  const isAffiliationsAvailable =
    grantedPolicies &&
    !(await isUnauthorized({
      requiredPolicies: ["CRMService.TaxOffices.ViewAffiliationList", "AbpIdentity.Roles"],
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
  if (isAffiliationsAvailable) {
    tabListItems.push({
      label: languageData["CRM.Affiliations"],
      href: `${baseLink}affiliations`,
    });
  }
  return (
    <>
      <PartyHeader details={taxFreeDetailResponse.data} partyType="tax-offices" />
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
