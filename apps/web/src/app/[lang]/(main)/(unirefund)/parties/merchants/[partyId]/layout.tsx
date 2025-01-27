"use server";

import { TabLayout } from "@repo/ayasofyazilim-ui/templates/tab-layout";
import { getResourceData } from "src/language-data/unirefund/CRMService";
import { getBaseLink } from "src/utils";

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
  const { partyId, lang } = params;
  const { languageData } = await getResourceData(lang);
  const baseLink = getBaseLink(`parties/merchants/${partyId}/`, lang);
  return (
    <TabLayout
      orientation="vertical"
      tabList={[
        {
          label: "Details",
          href: `${baseLink}details/info`,
        },
        {
          label: languageData["Merchants.SubOrganization"],
          href: `${baseLink}sub-stores`,
        },
        {
          label: languageData.ProductGroups,
          href: `${baseLink}product-groups`,
        },
        {
          label: languageData.Affiliations,
          href: `${baseLink}affiliations`,
        },
      ]}
      variant="simple"
    >
      {children}
    </TabLayout>
  );
}
