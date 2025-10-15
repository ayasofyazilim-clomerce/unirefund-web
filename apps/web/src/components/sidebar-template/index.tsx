"use client";
import {
  SidebarContent,
  Sidebar,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
} from "@repo/ayasofyazilim-ui/atoms/sidebar";
import type {Policy, Polices} from "@repo/utils/policies";
import {isActionGranted, useGrantedPolicies} from "@repo/utils/policies";
import Link from "next/link";
import * as Icons from "lucide-react";
import type {LucideProps} from "lucide-react";
import type {FC, ReactNode} from "react";
import {isValidElement} from "react";
import {usePathname} from "next/navigation";

export type NavItem =
  | {
      id: string;
      isActive?: boolean;
      action: string | (() => Promise<void>);
      icon: IconName;
      name: string;
      permissions?: Policy[];
      condition?: boolean;
    }
  | ReactNode;

type IconName = keyof typeof Icons;

function RenderLucideIcon({icon, ...props}: {icon: IconName} & LucideProps) {
  // eslint-disable-next-line import/namespace -- because its necessary and not harmful
  const IconComponent = Icons[icon] as FC<LucideProps>;
  return <IconComponent {...props} />;
}

function getIsActive(item: Extract<NavItem, {action: unknown}>, pathname: string) {
  if (item.isActive) return true;
  if (typeof item.action !== "string") return false;
  const actionPathname = item.action.split("?")[0];
  return actionPathname === pathname;
}

function shouldRenderItem(item: NavItem, grantedPolicies: Polices): item is Extract<NavItem, {name: string}> {
  if (isValidElement(item)) return false;
  if (!item || typeof item !== "object" || !("name" in item)) return false;
  if (item.condition === false) return false;
  if (item.permissions && !isActionGranted(item.permissions, grantedPolicies)) return false;
  return true;
}

export function SidebarTemplate({
  children,
  footer,
  header,
  items,
}: {
  children: ReactNode;
  items: NavItem[];
  footer?: ReactNode;
  header?: ReactNode;
}) {
  const {grantedPolicies} = useGrantedPolicies();
  const pathname = usePathname();
  return (
    <SidebarProvider className="relative min-h-full gap-2 overflow-hidden">
      <Sidebar className="absolute z-50 h-full" collapsible="icon">
        <SidebarHeader className="border-b">{header}</SidebarHeader>
        <SidebarContent className="z-[100]">
          <SidebarGroup>
            <SidebarMenu>
              {items.map((item) => {
                if (isValidElement(item)) {
                  return item;
                }

                if (!shouldRenderItem(item, grantedPolicies)) {
                  return null;
                }

                const isActive = getIsActive(item, pathname);
                const isStringAction = typeof item.action === "string";

                const content = (
                  <>
                    <RenderLucideIcon icon={item.icon} />
                    <span>{item.name}</span>
                  </>
                );

                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      asChild={isStringAction}
                      isActive={isActive}
                      onClick={typeof item.action === "string" ? undefined : item.action}
                      tooltip={item.name}>
                      {typeof item.action === "string" ? (
                        <Link data-testid={item.id} href={item.action}>
                          {content}
                        </Link>
                      ) : (
                        content
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>{footer}</SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset className="h-full min-h-full">
        <main className="flex h-full flex-1 flex-col overflow-auto">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
