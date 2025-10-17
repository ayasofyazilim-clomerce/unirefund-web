"use client";

import type { LucideProps} from "lucide-react";
import {ChevronRight, MoreHorizontal} from "lucide-react";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
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
} from "@/components/ui/sidebar";
import type { Polices} from "@repo/utils/policies";
import {isActionGranted, useGrantedPolicies} from "@repo/utils/policies";
import * as LucideIcons from "lucide-react";
import Link from "next/link";
import {useParams} from "next/navigation";
import type {FC} from "react";
import type {AbpUiNavigationResource} from "@/language-data/core/AbpUiNavigation";
import type {NavItem, NavItemAction, NavProps} from "../data";

export function NavMain({items, languageData}: Omit<NavProps, "children">) {
  const {lang} = useParams<{lang: string}>();
  const {grantedPolicies} = useGrantedPolicies();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <NavbarRenderer grantedPolicies={grantedPolicies} items={items} lang={lang} languageData={languageData} />
    </SidebarGroup>
  );
}

type IconName = keyof typeof LucideIcons;
function RenderIcon({icon, ...props}: {icon: IconName} & LucideProps) {
  // eslint-disable-next-line import/namespace -- because its necessary and not harmful
  const IconComponent = LucideIcons[icon] as FC<LucideProps> | undefined;
  if (IconComponent) return <IconComponent {...props} />;
  return null;
}

// Render actions for nav items
function RenderNavActions({
  actions,
  lang,
  grantedPolicies,
  languageData,
}: {
  actions: NavItemAction[];
  lang: string;
  grantedPolicies: Polices;
  languageData: AbpUiNavigationResource;
}) {
  // Filter visible actions based on policies
  const visibleActions = actions.filter((action) => {
    return !action.policies ? true : isActionGranted(action.policies, grantedPolicies);
  });

  if (visibleActions.length === 0) return null;

  // Single action - render as button
  if (visibleActions.length === 1) {
    const action = visibleActions[0];
    return (
      <SidebarMenuAction asChild className="text-muted-foreground relative !inset-auto size-7 items-center">
        {action.href ? (
          <Link
            data-testid={`/${lang}/${action.href}`}
            href={`/${lang}/${action.href}`}
            title={languageData[action.description]}>
            {action.icon ? <RenderIcon icon={action.icon} /> : <span>{action.displayName}</span>}
          </Link>
        ) : (
          <button data-testid={action.displayName} title={languageData[action.description]} type="button">
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
      <DropdownMenuContent align="start" side="right">
        {visibleActions.map((action) => (
          <DropdownMenuItem asChild key={action.key}>
            {action.href ? (
              <Link data-testid={`/${lang}/${action.href}`} href={`/${lang}/${action.href}`}>
                {action.icon ? <RenderIcon className="mr-2 h-4 w-4" icon={action.icon} /> : null}
                <span>{action.displayName}</span>
              </Link>
            ) : (
              <button className="w-full" data-testid={action.displayName} type="button">
                {action.icon ? <RenderIcon className="mr-2 h-4 w-4" icon={action.icon} /> : null}
                <span>{action.displayName}</span>
              </button>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Recursive renderer for nested nav items
function RenderNavItem({
  item,
  depth = 0,
  lang,
  languageData,
  grantedPolicies,
}: {
  item: NavItem;
  depth?: number;
  lang: string;
  languageData: AbpUiNavigationResource;
  grantedPolicies: Polices;
}) {
  // Check visibility based on policies
  const isVisible = !item.policies ? true : isActionGranted(item.policies, grantedPolicies);
  if (!isVisible) return null;

  const isItemLink = Boolean(item.href);
  const hasChildren = Boolean(item.items && item.items.length > 0);
  const hasActions = Boolean(item.actions && item.actions.length > 0);

  // Item content with icon, text, and chevron
  const ItemContent = (
    <>
      {item.icon ? <RenderIcon icon={item.icon} /> : null}
      <span>{languageData[item.displayName]}</span>
      {hasChildren ? <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" /> : null}
    </>
  );

  // Determine which component to use based on depth
  const MenuButtonComponent = depth === 0 ? SidebarMenuButton : SidebarMenuSubButton;
  const MenuItemComponent = depth === 0 ? SidebarMenuItem : SidebarMenuSubItem;

  // Render the button/link
  const ItemButton = (
    <MenuButtonComponent
      asChild={isItemLink}
      className="w-full"
      tooltip={depth === 0 ? languageData[item.displayName] : undefined}>
      {isItemLink ? (
        <Link data-testid={`/${lang}/${item.href}`} href={`/${lang}/${item.href}`}>
          {ItemContent}
        </Link>
      ) : (
        ItemContent
      )}
    </MenuButtonComponent>
  );

  // If no children, return simple item (with actions at any depth)
  if (!hasChildren) {
    // For depth > 0, we need to wrap the content differently
    if (depth > 0) {
      return (
        <>
          {ItemButton}
          {hasActions ? <RenderNavActions
              actions={item.actions || []}
              grantedPolicies={grantedPolicies}
              lang={lang}
              languageData={languageData}
            /> : null}
        </>
      );
    }

    // For depth === 0
    return (
      <MenuItemComponent className="flex items-center gap-2" key={item.key}>
        {ItemButton}
        {hasActions ? <RenderNavActions
            actions={item.actions || []}
            grantedPolicies={grantedPolicies}
            lang={lang}
            languageData={languageData}
          /> : null}
      </MenuItemComponent>
    );
  }

  // Filter visible children
  const visibleChildren = item.items
    ? item.items.filter((subItem) => {
        const isChildVisible = !subItem.policies ? true : isActionGranted(subItem.policies, grantedPolicies);
        return isChildVisible;
      })
    : [];
  if (visibleChildren.length === 0) return null;

  // If has children, return collapsible (with actions at any depth)
  return (
    <Collapsible asChild className="group/collapsible w-full" key={item.key}>
      <MenuItemComponent>
        <CollapsibleTrigger asChild data-testid={item.key}>
          {ItemButton}
        </CollapsibleTrigger>
        {hasActions ? <RenderNavActions
            actions={item.actions || []}
            grantedPolicies={grantedPolicies}
            lang={lang}
            languageData={languageData}
          /> : null}
        <CollapsibleContent>
          <SidebarMenuSub className="mr-0 pr-0">
            {visibleChildren.map((subItem) => (
              <SidebarMenuSubItem className="relative flex w-full items-center gap-2 pr-1" key={subItem.key}>
                <RenderNavItem
                  depth={depth + 1}
                  grantedPolicies={grantedPolicies}
                  item={subItem}
                  lang={lang}
                  languageData={languageData}
                />
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </MenuItemComponent>
    </Collapsible>
  );
}

export function NavbarRenderer({
  ...props
}: {
  items: NavItem[];
  lang: string;
  languageData: AbpUiNavigationResource;
  grantedPolicies: Polices;
}) {
  return (
    <SidebarMenu>
      {props.items.map((item) => {
        return <RenderNavItem depth={0} item={item} key={item.key} {...props} />;
      })}
    </SidebarMenu>
  );
}
