"use client";
import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator} from "@repo/ayasofyazilim-ui/atoms/breadcrumb";
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
import {BreadcrumbItemType, NavbarItemsFromDB} from "@repo/ui/theme/types";
import {ChevronDown} from "lucide-react";
import Link from "next/link";
import {Fragment} from "react";
import {icons} from "../navbar";

function BreadcrumbIcon({item}: {item: NavbarItemsFromDB}) {
  return item.icon in icons ? icons[item.icon as keyof typeof icons] : null;
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
      <DropdownMenuTrigger className="flex items-center gap-1" asChild>
        <Button
          variant="ghost"
          className={`px-2 text-gray-600 outline-none ring-0 focus-visible:ring-0 ${isLastNavbarItem ? "bg-accent" : ""}`}>
          <BreadcrumbIcon item={item} />
          {item.displayName}
          <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" style={{zIndex: 1000}}>
        {item.subNavbarItems?.map((subItem) => {
          const subSubItems = navbarItems.filter((i) => i.href && i.parentNavbarItemKey === subItem.key);
          return (
            <Link key={subItem.key} href={"/" + subItem.href || "#"}>
              {subSubItems.length > 0 ? (
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <BreadcrumbIcon item={subItem} />
                    <span>{subItem.displayName}</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      {subSubItems
                        ?.filter((i) => i.href)
                        .map((subSubItem) => {
                          const subSubSubItems = navbarItems.filter(
                            (i) => i.href && i.parentNavbarItemKey === subSubItem.key,
                          );
                          return subSubSubItems.length > 0 ? (
                            <DropdownMenuSub key={subSubItem.key}>
                              <Link key={subSubItem.key} href={"/" + subSubItem.href || "#"}>
                                <DropdownMenuSubTrigger>
                                  <BreadcrumbIcon item={subSubItem} />
                                  <span>{subSubItem.displayName}</span>
                                </DropdownMenuSubTrigger>
                              </Link>
                              <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                  {subSubSubItems
                                    ?.filter((i) => i.href)
                                    .map((subSubSubItem) => (
                                      <Link key={subSubSubItem.key} href={"/" + subSubSubItem.href || "#"}>
                                        <DropdownMenuItem>
                                          <BreadcrumbIcon item={subSubSubItem} />
                                          {subSubSubItem.displayName}
                                        </DropdownMenuItem>
                                      </Link>
                                    ))}
                                </DropdownMenuSubContent>
                              </DropdownMenuPortal>
                            </DropdownMenuSub>
                          ) : (
                            <Link key={subSubItem.key} href={"/" + subSubItem.href || "#"}>
                              <DropdownMenuItem>
                                <BreadcrumbIcon item={subSubItem} />
                                {subSubItem.displayName}
                              </DropdownMenuItem>
                            </Link>
                          );
                        })}
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
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
function BreadcrumbSingleItem({item, isActive}: {item: BreadcrumbItemType; isActive: boolean}) {
  return (
    <Button variant="ghost" className={`px-2 text-gray-600 ${isActive ? "bg-accent" : ""}`} asChild>
      <Link href={"/" + item.href || "#"} className="flex flex-row items-center gap-1 px-2 text-gray-600">
        <>
          {item.icon in icons ? icons[item.icon as keyof typeof icons] : null}
          {item.displayName}
        </>
      </Link>
    </Button>
  );
}

const data: NavbarItemsFromDB[] = [];
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
        {navigation?.map((item, index) => (
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
