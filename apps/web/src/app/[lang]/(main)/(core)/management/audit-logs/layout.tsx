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
  const baseLink = getBaseLink("management/audit-logs/", lang);

  return (
    <TabLayout
      tabList={[
        {
          label: languageData["AuditLog.AuditLogs"],
          href: `${baseLink}audit-logs`,
        },
        {
          label: languageData["AuditLog.EntityChanges"],
          href: `${baseLink}entity-changes`,
        },
      ]}>
      {children}
    </TabLayout>
  );
}
