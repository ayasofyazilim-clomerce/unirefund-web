"use client"

import { ChevronRight, LucideProps, MoreHorizontal } from "lucide-react"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"

import { AbpUiNavigationResource } from "@/language-data/core/AbpUiNavigation"
import { isActionGranted, Polices, useGrantedPolicies } from "@repo/utils/policies"
import * as LucideIcons from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { FC } from "react"
import { NavItem, NavItemAction, NavProps } from "../data"


export function NavMain({ items, languageData }: Omit<NavProps, "children">) {
    const { lang } = useParams<{ lang: string }>();
    const { grantedPolicies } = useGrantedPolicies();
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <NavbarRenderer items={items} lang={lang} grantedPolicies={grantedPolicies} languageData={languageData} />
        </SidebarGroup>
    )
}


type IconName = keyof typeof LucideIcons;
function RenderIcon({ icon, ...props }: { icon: IconName } & LucideProps) {
    // eslint-disable-next-line import/namespace -- because its necessary and not harmful
    const IconComponent = LucideIcons[icon] as FC<LucideProps> | undefined;
    if (IconComponent) return <IconComponent {...props} />
    return null
}

// Render actions for nav items
const RenderNavActions = ({
    actions,
    lang,
    grantedPolicies,
    languageData,
}: {
    actions: NavItemAction[],
    lang: string,
    grantedPolicies: Polices,
    languageData: AbpUiNavigationResource
}) => {
    // Filter visible actions based on policies
    const visibleActions = actions.filter((action) => {
        return !action.policies ? true : isActionGranted(action.policies, grantedPolicies);
    });

    if (visibleActions.length === 0) return null;

    // Single action - render as button
    if (visibleActions.length === 1) {
        const action = visibleActions[0];
        return (
            <SidebarMenuAction asChild className="size-7 relative items-center !inset-auto text-muted-foreground">
                {action.href ? (
                    <Link data-testid={`/${lang}/${action.href}`} href={`/${lang}/${action.href}`} title={languageData[action.description]}>
                        {action.icon ? <RenderIcon icon={action.icon} /> : <span>{action.displayName}</span>}
                    </Link>
                ) : (
                    <button type="button" data-testid={action.displayName} title={languageData[action.description]}>
                        {action.icon ? <RenderIcon icon={action.icon} /> : <span>{action.displayName}</span>}
                    </button>
                )}
            </SidebarMenuAction>
        );
    }

    // Multiple actions - render as dropdown
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild data-testid="more-actions">
                <SidebarMenuAction>
                    <MoreHorizontal />
                    <span className="sr-only">More actions</span>
                </SidebarMenuAction>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start">
                {visibleActions.map((action) => (
                    <DropdownMenuItem key={action.key} asChild>
                        {action.href ? (
                            <Link data-testid={`/${lang}/${action.href}`} href={`/${lang}/${action.href}`}>
                                {action.icon && <RenderIcon icon={action.icon} className="mr-2 h-4 w-4" />}
                                <span>{action.displayName}</span>
                            </Link>
                        ) : (
                            <button type="button" data-testid={action.displayName} className="w-full">
                                {action.icon && <RenderIcon icon={action.icon} className="mr-2 h-4 w-4" />}
                                <span>{action.displayName}</span>
                            </button>
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

// Recursive renderer for nested nav items
const RenderNavItem = ({
    item,
    depth = 0,
    lang,
    languageData,
    grantedPolicies
}: {
    item: NavItem;
    depth?: number,
    lang: string,
    languageData: AbpUiNavigationResource,
    grantedPolicies: Polices
}) => {
    // Check visibility based on policies
    const isVisible = !item.policies ? true : isActionGranted(item.policies, grantedPolicies);
    if (!isVisible) return null;

    const isItemLink = Boolean(item.href);
    const hasChildren = Boolean(item.items && item.items.length > 0);
    const hasActions = Boolean(item.actions && item.actions.length > 0);

    // Item content with icon, text, and chevron
    const ItemContent = (
        <>
            {item.icon && <RenderIcon icon={item.icon} />}
            <span>{languageData[item.displayName]}</span>
            {hasChildren && (
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            )}
        </>
    );

    // Determine which component to use based on depth
    const MenuButtonComponent = depth === 0 ? SidebarMenuButton : SidebarMenuSubButton;
    const MenuItemComponent = depth === 0 ? SidebarMenuItem : SidebarMenuSubItem;

    // Render the button/link
    const ItemButton = (
        <MenuButtonComponent className="w-full" tooltip={depth === 0 ? languageData[item.displayName] : undefined} asChild={isItemLink}>
            {isItemLink ? <Link data-testid={`/${lang}/${item.href}`} href={`/${lang}/${item.href}`}>{ItemContent}</Link> : ItemContent}
        </MenuButtonComponent>
    );

    // If no children, return simple item (with actions at any depth)
    if (!hasChildren) {
        // For depth > 0, we need to wrap the content differently
        if (depth > 0) {
            return (
                <>
                    {ItemButton}
                    {hasActions && <RenderNavActions languageData={languageData} actions={item.actions || []} lang={lang} grantedPolicies={grantedPolicies} />}
                </>
            );
        }

        // For depth === 0
        return (
            <MenuItemComponent key={item.key} className="flex items-center gap-2">
                {ItemButton}
                {hasActions && <RenderNavActions languageData={languageData} actions={item.actions || []} lang={lang} grantedPolicies={grantedPolicies} />}
            </MenuItemComponent>
        );
    }

    // Filter visible children
    const visibleChildren = item.items ? item.items.filter((subItem) => {
        const isChildVisible = !subItem.policies ? true : isActionGranted(subItem.policies, grantedPolicies);
        return isChildVisible;
    }) : [];
    if (visibleChildren.length === 0) return null

    // If has children, return collapsible (with actions at any depth)
    return (
        <Collapsible
            key={item.key}
            asChild
            className="group/collapsible w-full"
        >
            <MenuItemComponent>
                <CollapsibleTrigger data-testid={item.key} asChild>{ItemButton}</CollapsibleTrigger>
                {hasActions && <RenderNavActions languageData={languageData} actions={item.actions || []} lang={lang} grantedPolicies={grantedPolicies} />}
                <CollapsibleContent>
                    <SidebarMenuSub className="pr-0 mr-0">
                        {visibleChildren.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.key} className="relative flex gap-2 items-center w-full pr-1">
                                <RenderNavItem item={subItem} depth={depth + 1} lang={lang} grantedPolicies={grantedPolicies} languageData={languageData} />
                            </SidebarMenuSubItem>
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </MenuItemComponent>
        </Collapsible>
    );
};

export const NavbarRenderer = ({ ...props }: { items: NavItem[], lang: string, languageData: AbpUiNavigationResource, grantedPolicies: Polices }) => {
    return (
        <SidebarMenu>
            {props.items.map((item) => {
                return (<RenderNavItem key={item.key} item={item} depth={0} {...props} />)
            })}
        </SidebarMenu>
    );
};
