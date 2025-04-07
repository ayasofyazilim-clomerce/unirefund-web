"use server";
import {TabLayout} from "@repo/ayasofyazilim-ui/templates/tab-layout";
import {getBaseLink} from "@/utils";
import {getResourceData} from "src/language-data/unirefund/CRMService";

export default async function Layout({
  children,
  params,
}: {
  params: {lang: string; partyType: string};
  children: React.ReactNode;
}) {
  const {languageData} = await getResourceData(params.lang);
  const baseLink = getBaseLink(`settings/affiliations/`, params.lang);
  return (
    <TabLayout
      classNames={{
        horizontal: {
          tabs: "rounded-md border p-6 mt-6",
        },
      }}
      tabList={[
        {
          label: languageData.Merchants,
          href: `${baseLink}merchants`,
        },
        {
          label: languageData.RefundPoints,
          href: `${baseLink}refund-points`,
        },
        {
          label: languageData.Customs,
          href: `${baseLink}customs`,
        },
        {
          label: languageData.TaxFree,
          href: `${baseLink}tax-free`,
        },
        {
          label: languageData.TaxOffices,
          href: `${baseLink}tax-offices`,
        },
      ]}>
      {children}
    </TabLayout>
  );
}
