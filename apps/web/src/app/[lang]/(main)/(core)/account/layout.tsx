"use server";
import {TabLayout} from "@repo/ayasofyazilim-ui/templates/tab-layout";
import {getResourceData} from "src/language-data/core/AccountService";
import {getBaseLink} from "src/utils";

export default async function Layout({
  children,
  params,
}: {
  params: {lang: string; vatStatementId: string};
  children: React.ReactNode;
}) {
  const {lang} = params;
  const {languageData} = await getResourceData(params.lang);
  const baseLink = getBaseLink("account/", lang);
  return (
    <TabLayout
      orientation="horizontal"
      tabList={[
        {
          label: languageData.Sessions,
          href: `${baseLink}sessions`,
        },
        {
          label: languageData.SecurityLogs,
          href: `${baseLink}security-logs`,
        },
        {
          label: languageData["Personal.Information"],
          href: `${baseLink}personal-information`,
        },
        {
          label: languageData["Change.Password"],
          href: `${baseLink}change-password`,
        },
        {
          label: languageData["Profile.Picture"],
          href: `${baseLink}profile-picture`,
        },
      ]}>
      {children}
    </TabLayout>
  );
}
