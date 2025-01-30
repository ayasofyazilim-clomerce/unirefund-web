"use server";
import { TabLayout } from "@repo/ayasofyazilim-ui/templates/tab-layout";
import { getBaseLink } from "@/utils";
import { getResourceData } from "src/language-data/unirefund/FinanceService";

export default async function Layout({
  children,
  params,
}: {
  params: { lang: string; vatStatementId: string };
  children: React.ReactNode;
}) {
  const { languageData } = await getResourceData(params.lang);
  const baseLink = getBaseLink(
    `finance/vat-statements/${params.vatStatementId}/`,
    params.lang,
  );
  return (
    <TabLayout
      tabList={[
        {
          label: languageData["VatStatement.Information"],
          href: `${baseLink}information`,
        },
        {
          label: languageData["VatStatement.TaxFreeTags"],
          href: `${baseLink}tax-free-tags`,
        },
      ]}
    >
      {children}
    </TabLayout>
  );
}
