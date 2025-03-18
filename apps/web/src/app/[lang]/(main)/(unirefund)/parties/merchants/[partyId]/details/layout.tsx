"use server";

import {TabLayout} from "@repo/ayasofyazilim-ui/templates/tab-layout";
import {auth} from "@repo/utils/auth/next-auth";
import {getMerchantOrganizationsByIdApi} from "@repo/actions/unirefund/CrmService/actions";
import {getResourceData} from "src/language-data/unirefund/CRMService";
import {getBaseLink} from "src/utils";

async function getApiRequests({partyId}: {partyId: string}) {
  try {
    const session = await auth();
    const apiRequests = await Promise.all([getMerchantOrganizationsByIdApi(partyId, session)]);
    return {
      type: "success" as const,
      data: apiRequests,
    };
  } catch (error) {
    const err = error as {data?: string; message?: string};
    return {
      type: "error" as const,
      message: err.message,
    };
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

  const apiRequests = await getApiRequests({partyId});

  const isOrganization = apiRequests.type !== "error" && apiRequests.data[0].data.length > 0;

  const baseLink = getBaseLink(`parties/merchants/${partyId}/details/`, lang);
  const {languageData} = await getResourceData(lang);
  return (
    <TabLayout
      tabList={[
        {
          label: "Info",
          href: `${baseLink}info`,
        },
        {
          label: languageData["Parties.Organization"],
          href: `${baseLink}organization`,
          disabled: !isOrganization,
        },
        {
          label: languageData.Email,
          href: `${baseLink}email`,
        },
        {
          label: languageData.Telephone,
          href: `${baseLink}phone`,
        },
        {
          label: languageData.Address,
          href: `${baseLink}address`,
        },
      ]}>
      {children}
    </TabLayout>
  );
}
