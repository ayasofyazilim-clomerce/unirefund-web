"use client"

import { Breadcrumb as BreadcrumbCore, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Fragment, useEffect } from "react";
import { useSidebarLayout } from "../provider";
import { usePathname } from "next/navigation";

export default function Breadcrumb() {
    const { breadcrumbs, setBreadcrumbsFromPath } = useSidebarLayout();
    const pathname = usePathname();

    useEffect(() => {
        setBreadcrumbsFromPath(pathname);
    }, [pathname, setBreadcrumbsFromPath]);
    return (
        <header className="flex h-full shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
            />
            <BreadcrumbCore>
                <BreadcrumbList>
                    {breadcrumbs.map((crumb, index) => (
                        <Fragment key={`${crumb.label}-${index}`}>
                            {index > 0 && (
                                <BreadcrumbSeparator className="hidden md:block" />
                            )}
                            <BreadcrumbItem
                                className={index === 0 ? "hidden md:block" : ""}
                            >
                                {crumb.href ? (
                                    <BreadcrumbLink href={crumb.href}>
                                        {crumb.label}
                                    </BreadcrumbLink>
                                ) : (
                                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                                )}
                            </BreadcrumbItem>
                        </Fragment>
                    ))}
                </BreadcrumbList>
            </BreadcrumbCore>
        </header>
    );
}