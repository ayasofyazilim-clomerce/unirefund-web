"use server";

import { TabLayout } from "@repo/ayasofyazilim-ui/templates/tab-layout";
import { getResourceData } from "src/language-data/unirefund/TravellerService";
import { getBaseLink } from "src/utils";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    travellerId: string;
    lang: string;
  };
}) {
  const { travellerId, lang } = params;
  const { languageData } = await getResourceData(lang);
  const baseLink = getBaseLink(`parties/travellers/${travellerId}/`, lang);
  return (
    <TabLayout
      orientation="vertical"
      tabList={[
        {
          label: languageData["Travellers.Personal.Identifications"],
          href: `${baseLink}personal-identifications`,
        },
        {
          label: languageData["Travellers.Personal.Preferences"],
          href: `${baseLink}personal-prefences`,
        },
        {
          label: languageData["Travellers.Personal.Summary"],
          href: `${baseLink}personal-summary`,
        },
      ]}
      variant="simple"
    >
      {children}
    </TabLayout>
  );
}
