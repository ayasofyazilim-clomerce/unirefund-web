"use server";
import {TabLayout} from "@repo/ayasofyazilim-ui/templates/tab-layout";
import {getResourceData} from "src/language-data/core/AccountService";

export default async function Layout({
  children,
  params,
}: {
  params: {lang: string; vatStatementId: string};
  children: React.ReactNode;
}) {
  const {languageData} = await getResourceData(params.lang);
  return (
    <TabLayout
      orientation="horizontal"
      tabList={[
        {
          label: languageData.Sessions,
          href: "sessions",
        },
        {
          label: languageData.SecurityLogs,
          href: "security-logs",
        },
        {
          label: languageData["Personal.Information"],
          href: "personal-information",
        },
        {
          label: languageData["Change.Password"],
          href: "change-password",
        },
        {
          label: languageData["Profile.Picture"],
          href: "profile-picture",
        },
      ]}>
      {children}
    </TabLayout>
  );
}
