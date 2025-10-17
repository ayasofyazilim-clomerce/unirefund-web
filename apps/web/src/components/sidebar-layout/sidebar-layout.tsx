import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar";
import React from "react";
import NavHeader from "./breadcrumb/breadcrumb";
import type { NavProps} from "./data";
import {NavItems} from "./data";
import AffiliationSwitch from "./nav/affiliation-swittcher";
import {NavMain} from "./nav/main";
import {NavUser} from "./nav/user";
import {SidebarLayoutProvider} from "./provider";

export default function SidebarLayout({children, ...props}: Omit<NavProps, "items"> & {children: React.ReactNode}) {
  return (
    <SidebarLayoutProvider languageData={props.languageData} navItems={NavItems}>
      <SidebarProvider>
        <Sidebar collapsible="icon" {...props}>
          <SidebarHeader className="h-16 justify-center border-b">
            <AffiliationSwitch affiliations={props.affiliations} languageData={props.languageData} />
          </SidebarHeader>
          <SidebarContent>
            <NavMain items={NavItems} {...props} />
          </SidebarContent>
          <SidebarFooter>
            <NavUser languageData={props.languageData} user={props.user} />
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <div className="grid min-h-svh w-full grid-rows-[4rem_1fr]">
          <NavHeader />
          <SidebarInset className="min-h-full overflow-hidden p-4 has-[>.pp-0]:p-0 [&>*]:m-0 [&>*]:h-0 [&>*]:flex-grow">
            {children}
          </SidebarInset>
        </div>
      </SidebarProvider>
    </SidebarLayoutProvider>
  );
}
