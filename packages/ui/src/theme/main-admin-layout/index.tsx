"use client";

import { ThemeProvider } from "../../providers/theme";
import HeaderSection from "./header-section";

function MainAdminLayout(props: any) {
  return (
    <ThemeProvider
      appName={props.appName}
      logo={props.logo}
      baseURL={props.baseURL}
      navbarItems={props.navbarItems}
      profileMenu={props.profileMenu}
      prefix={props.prefix}
      lang={props.lang}
      tenantData={props.tenantData}
    >
      <HeaderSection />
    </ThemeProvider>
  );
}

export default MainAdminLayout;
