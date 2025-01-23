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
  const { languageData } = await getResourceData(lang);
  const baseLink = getBaseLink(`parties/merchants/${merchantId}/`, lang);
  return (
    <TabLayout
      orientation="vertical"
      tabList={[
        {
          label: "Details",
          href: `${baseLink}detail/info`,
        },
        {
          label: languageData["Merchants.SubOrganization"],
          href: `${baseLink}sub-stores`,
        },
      ]}
      variant="simple"
    >
      {children}
    </TabLayout>
  );
}
