"use client";
import {ChevronDown} from "lucide-react";
import Link from "next/link";
import {Fragment} from "react";
import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator} from "@repo/ayasofyazilim-ui/atoms/breadcrumb";
import {Button} from "@repo/ayasofyazilim-ui/atoms/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@repo/ayasofyazilim-ui/atoms/dropdown-menu";
import {BreadcrumbItemType, NavbarItemsFromDB} from "@repo/ui/theme/types";
import {icons} from "../navbar";
import {useRouter} from "next/navigation";

function BreadcrumbIcon({item}: {item: NavbarItemsFromDB}) {
  return icons[item.icon as keyof typeof icons] || null;
}

function RenderDropdownMenu({items, navbarItems}: {items: NavbarItemsFromDB[]; navbarItems: NavbarItemsFromDB[]}) {
  const router = useRouter();
  return items.map((item) => {
    const subItems = navbarItems.filter((i) => i.href && i.parentNavbarItemKey === item.key);
    return subItems.length > 0 ? (
      <DropdownMenuSub key={item.key}>
        <DropdownMenuSubTrigger className="gap-1 font-medium">
          <BreadcrumbIcon item={item} />
          <span>{item.displayName}</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            {item.href && (
              <>
                <DropdownMenuItem asChild>
                  <Link
                    href={item.href ? "/" + item.href : "#"}
                    className="flex cursor-pointer items-center gap-1 px-2 font-medium">
                    <BreadcrumbIcon item={item} />
                    {item.displayName}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <RenderDropdownMenu items={subItems} navbarItems={navbarItems} />
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    ) : (
      <Fragment key={item.key}>
        {item.split && (item.split === "top" || item.split === "both") && <DropdownMenuSeparator />}
        <DropdownMenuItem key={item.key} asChild>
          <Link
            href={item.href ? "/" + item.href : "#"}
            className="flex cursor-pointer items-center gap-1 px-2 font-medium">
            <BreadcrumbIcon item={item} />
            {item.displayName}
          </Link>
        </DropdownMenuItem>
        {item.split && (item.split === "bottom" || item.split === "both") && <DropdownMenuSeparator />}
      </Fragment>
    );
  });
}

export function BreadcrumbDropdown({
  item,
  navbarItems,
  isLastNavbarItem,
}: {
  item: BreadcrumbItemType;
  navbarItems: NavbarItemsFromDB[];
  isLastNavbarItem: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`cursor-pointer px-2 text-gray-600 outline-none ring-0 focus-visible:ring-0 ${
            isLastNavbarItem ? "bg-accent" : ""
          }`}>
          <BreadcrumbIcon item={item} />
          {item.displayName}
          <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" style={{zIndex: 1000}}>
        <RenderDropdownMenu items={item.subNavbarItems || []} navbarItems={navbarItems} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function BreadcrumbSingleItem({item, isActive}: {item: BreadcrumbItemType; isActive: boolean}) {
  return (
    <Button variant="ghost" className={`cursor-pointer px-2 text-gray-600 ${isActive ? "bg-accent" : ""}`} asChild>
      <Link href={"/" + item.href || "#"} className="flex items-center gap-1 px-2 text-gray-600">
        <BreadcrumbIcon item={item} />
        {item.displayName}
      </Link>
    </Button>
  );
}

function BreadcrumbNavigation({
  navbarItems,
  navigation,
}: {
  navbarItems: NavbarItemsFromDB[];
  navigation: BreadcrumbItemType[];
}) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {navigation
          ?.filter((i) => i.displayOrder !== -1)
          ?.map((item, index) => (
            <Fragment key={item.key}>
              {index !== 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {item.subNavbarItems?.filter((i) => i.href)?.length > 1 ? (
                  <BreadcrumbDropdown
                    item={item}
                    navbarItems={navbarItems}
                    isLastNavbarItem={index === navigation.length - 1}
                  />
                ) : (
                  <BreadcrumbSingleItem item={item} isActive={index === navigation.length - 1} />
                )}
              </BreadcrumbItem>
            </Fragment>
          ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default BreadcrumbNavigation;
