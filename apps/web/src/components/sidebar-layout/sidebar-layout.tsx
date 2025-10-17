import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarInset,
    SidebarProvider,
    SidebarRail
} from "@/components/ui/sidebar"
import React from "react"
import NavHeader from "./breadcrumb/breadcrumb"
import { NavItems, NavProps } from "./data"
import AffiliationSwitch from "./nav/affiliation-swittcher"
import { NavMain } from "./nav/main"
import { NavUser } from "./nav/user"
import { SidebarLayoutProvider } from "./provider"



export default function SidebarLayout({
    children,
    ...props
}: Omit<NavProps, "items"> & { children: React.ReactNode }
) {
    return (
        <SidebarLayoutProvider navItems={NavItems} languageData={props.languageData}>
            <SidebarProvider>
                <Sidebar collapsible="icon" {...props}>
                    <SidebarHeader className="h-16 border-b justify-center">
                        <AffiliationSwitch affiliations={props.affiliations} languageData={props.languageData} />
                    </SidebarHeader>
                    <SidebarContent>
                        <NavMain items={NavItems} {...props} />
                    </SidebarContent>
                    <SidebarFooter>
                        <NavUser user={props.user} languageData={props.languageData} />
                    </SidebarFooter>
                    <SidebarRail />
                </Sidebar>
                <div className="grid grid-rows-[4rem_1fr] min-h-svh w-full">
                    <NavHeader />
                    <SidebarInset className="min-h-full overflow-hidden has-[>.pp-0]:p-0 [&>*]:m-0 [&>*]:flex-grow [&>*]:h-0 p-4">
                        {children}
                    </SidebarInset>
                </div>
            </SidebarProvider>
        </SidebarLayoutProvider>
    )
}