"use server";
import { TabLayout } from "@repo/ayasofyazilim-ui/templates/tab-layout";
import { getResourceData } from "src/language-data/unirefund/CRMService";

export default async function Layout({
  children,
  params,
}: {
  params: { lang: string; vatStatementId: string };
  children: React.ReactNode;
}) {
  const { languageData } = await getResourceData(params.lang);
  return (
    <TabLayout
      tabList={[
        {
          label: languageData.Merchants,
          href: "merchants",
        },
        {
          label: languageData.RefundPoints,
          href: "refund-points",
        },
        {
          label: languageData.Customs,
          href: "customs",
        },
        {
          label: languageData.TaxFree,
          href: "tax-free",
        },
        {
          label: languageData.TaxOffices,
          href: "tax-offices",
        },
      ]}
    >
      {children}
    </TabLayout>
  );
}
