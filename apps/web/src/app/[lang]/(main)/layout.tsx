"use server";
import {LogOut} from "lucide-react";
import MainAdminLayout from "@repo/ui/theme/main-admin-layout";
import {getGrantedPoliciesApi} from "@repo/utils/api";
import {signOutServer} from "@repo/utils/auth";
import {auth} from "@repo/utils/auth/next-auth";
import type {Policy} from "@repo/utils/policies";
import unirefund from "public/unirefund.png";
import {getResourceData} from "src/language-data/core/AbpUiNavigation";
import Providers from "src/providers/providers";
import {getBaseLink} from "src/utils";
import {Novu} from "@/utils/navbar/notification";
import {getNavbarFromDB} from "../../../utils/navbar/navbar-data";
import {getProfileMenuFromDB} from "../../../utils/navbar/navbar-profile-data";

interface LayoutProps {
  params: {lang: string};
  children: JSX.Element;
}
const appName = process.env.APPLICATION_NAME || "UNIREFUND";
export default async function Layout({children, params}: LayoutProps) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);
  const session = await auth();
  const grantedPolicies = (await getGrantedPoliciesApi()) as Record<Policy, boolean>;
  const baseURL = getBaseLink("", lang);
  const navbarFromDB = await getNavbarFromDB(lang, languageData, grantedPolicies);
  const profileMenuProps = getProfileMenuFromDB(languageData);
  profileMenuProps.info.name = session?.user?.name ?? profileMenuProps.info.name;
  profileMenuProps.info.email = session?.user?.email ?? profileMenuProps.info.email;
  profileMenuProps.info.image = "https://flowbite.com/docs/images/people/profile-picture-5.jpg";

  profileMenuProps.menu.secondary = [
    {
      href: undefined,
      onClick: signOutServer,
      name: languageData.LogOut,
      icon: <LogOut className="mr-2 h-4 w-4" />,
    },
  ];
  const logo = appName === "UNIREFUND" ? unirefund : undefined;
  return (
    <Providers>
      <div className="flex h-full flex-col bg-white">
        <MainAdminLayout
          appName={appName}
          baseURL={baseURL}
          lang={lang}
          logo={logo}
          navbarItems={navbarFromDB}
          notification={
            <Novu
              appId={process.env.NOVU_APP_IDENTIFIER || ""}
              appUrl={process.env.NOVU_APP_URL || ""}
              subscriberId={session?.user?.novuSubscriberId || ""}
            />
          }
          prefix=""
          profileMenu={profileMenuProps}
          tenantData={undefined}
        />
        <div className="flex h-full flex-col overflow-hidden px-4">{children}</div>
      </div>
    </Providers>
  );
}
