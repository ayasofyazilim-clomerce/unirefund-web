"use server";

import {getRefundPointByIdApi} from "@repo/actions/unirefund/CrmService/actions";
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
    const requiredRequests = await Promise.all([getRefundPointByIdApi(partyId, session), getGrantedPoliciesApi()]);
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
  const baseLink = getBaseLink(`parties/refund-points/${partyId}/`, lang);

  const apiRequests = await getApiRequests({partyId});

  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message} />;
  }
  const [refundPointDetailResponse, grantedPolicies] = apiRequests.requiredRequests;
  const isHeadquarter =
    refundPointDetailResponse.data.parentId === null || refundPointDetailResponse.data.parentId === "";
  const isAffiliationsAvailable =
    grantedPolicies &&
    !(await isUnauthorized({
      requiredPolicies: [
        "CRMService.RefundPoints.ViewAffiliationList",
        "IdentityService.AssignableRoles.ViewAllRolesAssignableList",
        "IdentityService.AssignableRoles",
      ],
      grantedPolicies,
      lang,
      redirect: false,
    }));
  const isSubRefundPointsAvailable =
    isHeadquarter &&
    !(await isUnauthorized({
      requiredPolicies: ["CRMService.RefundPoints.ViewSubRefundPointList"],
      grantedPolicies,
      lang,
      redirect: false,
    }));
  const isContractsAvailable =
    isHeadquarter &&
    !(await isUnauthorized({
      requiredPolicies: [
        "ContractService.ContractHeaderForRefundPoint",
        "ContractService.ContractHeaderForRefundPoint.GetListDetailByRefundPointId",
      ],
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
  if (isSubRefundPointsAvailable) {
    tabListItems.push({label: languageData["CRM.RefundPoint.SubOrganization"], href: `${baseLink}sub-stores`});
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
      <PartyHeader details={refundPointDetailResponse.data} partyType="refund-points" />
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
