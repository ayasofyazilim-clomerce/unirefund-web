"use client";

import { Volo_Abp_LanguageManagement_Dto_LanguageDto } from "@repo/actions/core/AdministrationService/types";
import { NotificationProps } from "../../notification";
import { ThemeProvider } from "../../providers/theme";
import HeaderSection from "./header-section";

function MainAdminLayout(props: {
  notification: NotificationProps,
  appName: string,
  baseURL: string,
  lang: string,
  logo: any,
  navbarItems: any,
  prefix: string,
  profileMenu: any,
  tenantData: any,
  // Use a broad any[] type for languagesList to avoid leaking generated DTO types across packages
  languagesList: Volo_Abp_LanguageManagement_Dto_LanguageDto[];
}) {
  return (
    <ThemeProvider
      languagesList={props.languagesList}
      appName={props.appName}
      logo={props.logo}
      baseURL={props.baseURL}
      navbarItems={props.navbarItems}
      profileMenu={props.profileMenu}
      prefix={props.prefix}
      lang={props.lang}
      notification={props.notification}
      tenantData={props.tenantData}>
      <HeaderSection />
    </ThemeProvider>
  );
}

export default MainAdminLayout;
