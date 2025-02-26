"use client";

import { NavbarItemsFromDB, NotificationProps, ProfileMenuProps } from "@repo/ui/theme/types";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { createContext, useContext } from "react";

interface ThemeProviderProps {
  appName: string;
  logo?: string;
  baseURL: string;
  navbarItems: NavbarItemsFromDB[];
  profileMenu?: ProfileMenuProps;
  prefix: string;
  lang: string;
  tenantData?: { tenantId: string; tenantName: string };
  children: JSX.Element;
  notification: NotificationProps;
}
interface ThemeContextProps {
  appName: string;
  baseURL: string;
  logo?: string | StaticImport;
  prefix: string;
  profileMenu?: ProfileMenuProps;
  lang: string;
  navbarItems: NavbarItemsFromDB[];
  tenantData?: { tenantId: string; tenantName: string };
  notification?: NotificationProps
}

const ThemeProviderContext = createContext<ThemeContextProps>({
  appName: "UNIREFUND",
  baseURL: "",
  prefix: "app/new-layout",
  lang: "en",
  navbarItems: [],
  profileMenu: undefined,
  tenantData: undefined,
  notification: undefined,
  logo: "",
});

export const useTheme = () => {
  return useContext(ThemeProviderContext);
};

export function ThemeProvider({
  children,
  appName,
  baseURL,
  logo,
  prefix,
  profileMenu,
  lang,
  navbarItems,
  tenantData,
  notification
}: ThemeProviderProps) {
  return (
    <ThemeProviderContext.Provider
      value={{
        appName,
        baseURL,
        logo,
        navbarItems,
        prefix,
        lang,
        profileMenu,
        tenantData,
        notification
      }}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
