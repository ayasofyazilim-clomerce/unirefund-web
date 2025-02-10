"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@repo/ayasofyazilim-ui/atoms/breadcrumb";
import {Button} from "@repo/ayasofyazilim-ui/atoms/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@repo/ayasofyazilim-ui/atoms/dropdown-menu";
import {
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  ClipboardList,
  Fingerprint,
  Home,
  Key,
  Layers,
  Presentation,
  ShoppingBag,
  TicketSlash,
  User,
} from "lucide-react";
import Link from "next/link";
import {Fragment} from "react";
import type {NavbarItemType} from "../types";

const icons = {
  home: <Home className="mr-1 size-4 text-gray-600" />,
  dashboard: <Presentation className="mr-1 size-4" />,
  identity: <Fingerprint className="mr-1 size-4 text-gray-600" />,
  user: <User className="mr-1 size-4 text-gray-600" />,
  role: <Key className="mr-1 size-4 text-gray-600" />,
  management: <BriefcaseBusiness className="mr-1 size-4 text-gray-600" />,
  layer: <Layers className="mr-1 size-4 text-gray-600" />,
  clipboard: <ClipboardList className="mr-1 size-4 text-gray-600" />,
  shop: <ShoppingBag className="mr-1 size-4 text-gray-600" />,
  refund: <TicketSlash className="mr-1 size-4 text-gray-600" />,
  building: <Building2 className="mr-1 size-4 text-gray-600" />,
};

function BreadcrumbIcon({item}: {item: NavbarItemType}) {
  return item.icon in icons ? icons[item.icon as keyof typeof icons] : null;
}
export function BreadcrumbDropdown({
  item,
  navigation,
  isLastNavbarItem,
}: {
  item: NavbarItemType;
  navigation: NavbarItemType;
  isLastNavbarItem: boolean;
}) {
  if (!navigation?.subNavbarItems) return null;
  const dropdownItems = navigation?.subNavbarItems?.filter((i) => i.href);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1" asChild>
        <Button
          variant="ghost"
          className={`px-2 text-gray-600 outline-none ring-0 focus-visible:ring-0 ${isLastNavbarItem ? "bg-accent" : ""}`}>
          <BreadcrumbIcon item={item} />
          {item.displayName}
          <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {dropdownItems?.map((subItem) => (
          <Link key={subItem.key} href={subItem.href || "#"}>
            {subItem.subNavbarItems ? (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <BreadcrumbIcon item={subItem} />
                  <span>{subItem.displayName}</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {subItem.subNavbarItems
                      ?.filter((i) => i.href)
                      .map((subSubItem) => (
                        <Link key={subSubItem.key} href={subSubItem.href || "#"}>
                          <DropdownMenuItem>
                            <BreadcrumbIcon item={subSubItem} />
                            {subSubItem.displayName}
                          </DropdownMenuItem>
                        </Link>
                      ))}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            ) : (
              <DropdownMenuItem>
                <BreadcrumbIcon item={subItem} />
                {subItem.displayName}
              </DropdownMenuItem>
            )}
          </Link>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
function BreadcrumbSingleItem({item, isActive}: {item: NavbarItemType; isActive: boolean}) {
  return (
    <Button variant="ghost" className={`px-2 text-gray-600 ${isActive ? "bg-accent" : ""}`} asChild>
      <BreadcrumbLink href={item.href || "#"} className="flex flex-row items-center gap-1 px-2 text-gray-600">
        <>
          {item.icon in icons ? icons[item.icon as keyof typeof icons] : null}
          {item.displayName}
        </>
      </BreadcrumbLink>
    </Button>
  );
}

export function BreadcrumbNavigation({navigation}: {navigation: NavbarItemType[]}) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {navigation?.map((item, index) => (
          <Fragment key={item.key}>
            {index !== 0 && <BreadcrumbSeparator />}

            {/* Eğer önceki elemanın subNavbarItems'ı yoksa veya subNavbarItems'ı var ama içinde href'i olan eleman yoksa breadcrumbSingleItem render edilsin aksi takdirde dropdown render edilsin */}
            <BreadcrumbItem>
              {!navigation[index - 1]?.subNavbarItems ||
              navigation[index - 1]?.subNavbarItems?.filter((i) => i.href)?.length === 1 ? (
                <BreadcrumbSingleItem item={item} isActive={index === navigation.length - 1} />
              ) : (
                <BreadcrumbDropdown
                  item={item}
                  navigation={navigation?.[index - 1]}
                  isLastNavbarItem={index === navigation.length - 1}
                />
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
