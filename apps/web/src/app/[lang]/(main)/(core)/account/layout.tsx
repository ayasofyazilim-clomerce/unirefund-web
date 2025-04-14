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
      classNames={{
        horizontal: {
          tabs: "rounded-md border md:p-6 p-2 my-6",
          tabList:
            "md:w-max md:overflow-visible overflow-x-auto overflow-y-hidden scrollbar-thin justify-start md:px-1  pb-1 md:mb-4",
          tabTrigger: "md:flex-initial flex-shrink-0 whitespace-nowrap",
        },
      }}
      orientation="horizontal"
      tabList={[
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
        {
          label: languageData.Sessions,
          href: `${baseLink}sessions`,
        },
        {
          label: languageData.SecurityLogs,
          href: `${baseLink}security-logs`,
        },
      ]}>
      {children}
    </TabLayout>
  );
}
