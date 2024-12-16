"use server";
import MainAdminLayout from "@repo/ui/theme/main-admin-layout";
import { LogOut } from "lucide-react";
import { auth } from "auth";
import { signOutServer } from "auth-action";
import unirefund from "public/unirefund.png";
import { getResourceData } from "src/language-data/core/AbpUiNavigation";
import { getBaseLink } from "src/utils";
import { getNavbarFromDB } from "../../utils/navbar/navbar-data";
import { getProfileMenuFromDB } from "../../utils/navbar/navbar-profile-data";

interface LayoutProps {
  params: { lang: string };
  children: JSX.Element;
}
const appName = process.env.APPLICATION_NAME || "UNIREFUND";
export default async function Layout({ children, params }: LayoutProps) {
  const { lang } = params;
  const { languageData } = await getResourceData(lang);
  const session = await auth();
  const baseURL = getBaseLink("/", true, lang);
  const navbarFromDB = await getNavbarFromDB(lang, languageData, session);
  const profileMenuProps = getProfileMenuFromDB(languageData);
  profileMenuProps.info.name =
    session?.user?.name ?? profileMenuProps.info.name;
  profileMenuProps.info.email =
    session?.user?.email ?? profileMenuProps.info.email;
  profileMenuProps.info.image =
    "https://flowbite.com/docs/images/people/profile-picture-5.jpg";

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
    <div className="flex h-full flex-col bg-white">
      <MainAdminLayout
        appName={appName}
        baseURL={baseURL}
        lang={lang}
        logo={logo}
        navbarItems={navbarFromDB}
        prefix=""
        profileMenu={profileMenuProps}
      />
      <div className="flex h-full flex-col overflow-hidden px-4">
        {children}
      </div>
    </div>
  );
}
