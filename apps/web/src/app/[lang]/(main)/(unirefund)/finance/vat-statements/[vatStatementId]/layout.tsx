"use server";
import {TabLayout} from "@repo/ayasofyazilim-ui/templates/tab-layout";
import {getBaseLink} from "@/utils";
import {getResourceData} from "src/language-data/unirefund/FinanceService";

export default async function Layout({
  children,
  params,
}: {
  params: {lang: string; vatStatementId: string};
  children: React.ReactNode;
}) {
  const {lang, vatStatementId} = params;
  const {languageData} = await getResourceData(lang);
  const baseLink = getBaseLink(`finance/vat-statements/${vatStatementId}/`, lang);

  return (
    <div className="my-6 space-y-6 rounded-md border p-6">
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
        ]}>
        {children}
      </TabLayout>
    </div>
  );
}
