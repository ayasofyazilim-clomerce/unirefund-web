"use server";
import { TabLayout } from "@repo/ayasofyazilim-ui/templates/tab-layout";
import { getResourceData } from "src/language-data/unirefund/FinanceService";

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
          label: languageData["VatStatements.Information"],
          href: "information",
        },
        {
          label: languageData["VatStatements.TaxFreeTags"],
          href: "tax-free-tags",
        },
      ]}
    >
      {children}
    </TabLayout>
  );
}
