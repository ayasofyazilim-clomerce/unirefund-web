"use server";

import {TabLayout} from "@repo/ayasofyazilim-ui/templates/tab-layout";
import {getResourceData} from "src/language-data/core/AdministrationService";
import {getBaseLink} from "src/utils";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    lang: string;
  };
}) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);
  const baseLink = getBaseLink("management/logs/", lang);

  return (
    <TabLayout
      classNames={{
        horizontal: {
          tabs: "mt-6 p-6 rounded-md border",
          tabList: "mx-auto mb-2",
          tabTrigger: "px-12  text-sm font-medium text-gray-700",
        },
      }}
      tabList={[
        {
          label: languageData["Log.Audit"],
          href: `${baseLink}audit`,
        },
        {
          label: languageData["Log.EntityChanges"],
          href: `${baseLink}entity-changes`,
        },
      ]}>
      {children}
    </TabLayout>
  );
}
