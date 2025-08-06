"use server";

import {getCustomByIdApi} from "@repo/actions/unirefund/CrmService/actions";
import {TabLayout} from "@repo/ayasofyazilim-ui/templates/tab-layout";
import ErrorComponent from "@repo/ui/components/error-component";
import {auth} from "@repo/utils/auth/next-auth";
import {isRedirectError} from "next/dist/client/components/redirect";
import {structuredError} from "@repo/utils/api";
import {getResourceData} from "src/language-data/unirefund/CRMService";
import {getBaseLink} from "src/utils";
import PartyHeader from "../../_components/party-header";

async function getApiRequests({partyId}: {partyId: string}) {
  try {
    const session = await auth();
    const requiredRequests = await Promise.all([getCustomByIdApi(partyId, session)]);
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
  const baseLink = getBaseLink(`parties/customs/${partyId}/`, lang);

  const apiRequests = await getApiRequests({partyId});

  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message} />;
  }
  const [customDetailResponse] = apiRequests.requiredRequests;
  const isHeadquarter = customDetailResponse.data.typeCode === "HEADQUARTER";
  return (
    <>
      <PartyHeader
        link={`${baseLink}details`}
        name={customDetailResponse.data.name}
        parentId={customDetailResponse.data.parentId}
      />
      <TabLayout
        classNames={{
          vertical: {
            tabs: "overflow-hidden",
            tabContent: "overflow-hidden",
          },
        }}
        orientation="vertical"
        tabList={[
          {
            label: languageData["CRM.Details"],
            href: `${baseLink}details`,
          },
          ...(!isHeadquarter ? [] : [{label: languageData["CRM.SubOrganization"], href: `${baseLink}sub-stores`}]),
          {
            label: languageData["CRM.Affiliations"],
            href: `${baseLink}affiliations`,
          },
        ]}
        variant="simple">
        {children}
      </TabLayout>
    </>
  );
}
