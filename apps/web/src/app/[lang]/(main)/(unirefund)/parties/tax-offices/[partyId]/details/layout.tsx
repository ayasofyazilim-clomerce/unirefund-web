"use server";

import {TabLayout} from "@repo/ayasofyazilim-ui/templates/tab-layout";
import {getResourceData} from "src/language-data/unirefund/CRMService";
import {getBaseLink} from "src/utils";

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
  const baseLink = getBaseLink(`parties/tax-offices/${partyId}/details/`, lang);
  const {languageData} = await getResourceData(lang);
  return (
    <TabLayout
      classNames={{
        horizontal: {
          // Ensure the tab list scrolls horizontally on smaller screens
          tabList:
            "overflow-x-auto whitespace-nowrap  lg:overflow-x-hidden w-full lg:w-max justify-start lg::justify-center",
        },
      }}
      tabList={[
        {
          label: "Info",
          href: `${baseLink}info`,
        },
        {
          label: languageData["Parties.Organization"],
          href: `${baseLink}organization`,
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
