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
  const baseLink = getBaseLink(`parties/customs/${partyId}/details/`, lang);
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
