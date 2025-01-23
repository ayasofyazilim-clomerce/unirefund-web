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
    merchantId: string;
    lang: string;
  };
}) {
  const { merchantId, lang } = params;
  const baseLink = getBaseLink(`parties/merchants/${merchantId}/detail/`, lang);
  const { languageData } = await getResourceData(lang);
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
      ]}
    >
      {children}
    </TabLayout>
  );
}
