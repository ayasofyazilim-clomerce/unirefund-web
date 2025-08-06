"use server";

import {getIndividualByIdApi} from "@repo/actions/unirefund/CrmService/actions";
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
    const requiredRequests = await Promise.all([getIndividualByIdApi(partyId, session)]);
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
  const baseLink = getBaseLink(`parties/individuals/${partyId}/`, lang);

  const apiRequests = await getApiRequests({partyId});

  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message} />;
  }
  const [taxFreeDetailResponse] = apiRequests.requiredRequests;
  return (
    <>
      <PartyHeader
        link={`${baseLink}details`}
        name={`${taxFreeDetailResponse.data.firstname} ${taxFreeDetailResponse.data.lastname}`}
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
        ]}
        variant="simple">
        {children}
      </TabLayout>
    </>
  );
}
