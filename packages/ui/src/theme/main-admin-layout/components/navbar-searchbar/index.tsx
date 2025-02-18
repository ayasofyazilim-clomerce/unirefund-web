"use client";
import {Search, Star} from "lucide-react";
import {useRouter} from "next/navigation";
import {useEffect, useMemo, useState} from "react";
import {StarFilledIcon} from "@radix-ui/react-icons";
import {Button} from "@repo/ayasofyazilim-ui/atoms/button";
import {
    Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
    CommandSeparator
} from "@repo/ayasofyazilim-ui/atoms/command";
import {DialogTitle} from "@repo/ayasofyazilim-ui/atoms/dialog";
import {NavbarItemsFromDB} from "@repo/ui/theme/types";
import {icons} from "../navbar";

function getFavouriteSearches() {
  if (typeof window === "undefined") return [];

  const cat = localStorage.getItem("favouriteSearches");
  if (cat) {
    return JSON.parse(cat);
  }
  return [];
}
type SearchableNavbarItem = {
  key: string;
  icon: string;
  displayName: string;
  route: string;
  href: string;
  searchableText: string;
};
function SearchBar({navbarItems, prefix}: {navbarItems: NavbarItemsFromDB[]; prefix: string}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [favouriteSearches, setFavouriteSearches] = useState(getFavouriteSearches());
  const router = useRouter();

  const searchableItems: SearchableNavbarItem[] = useMemo(() => {
    return navbarItems
      .filter((i) => i.href)
      .map((item) => {
        const routes: string[] = [];
        let parentKey: string | null = item.parentNavbarItemKey;
        while (parentKey) {
          const parent = navbarItems.find((i) => i.key === parentKey);
          if (parent) {
            routes.unshift(parent.displayName);
            parentKey = parent.parentNavbarItemKey;
          } else {
            parentKey = null;
          }
        }
        if (routes.length > 0) {
          routes.shift(); //remove Home
        }
        return {
          ...item,
          href: item.href!,
          route: `${routes.join(" > ")}`,
          searchableText: `${routes.join(" ")} ${item.displayName}`.toLocaleLowerCase(),
        };
      })
      .filter((i) => i.route.length > 0);
  }, [navbarItems]);

  const favourites = useMemo(() => {
    return searchableItems.filter((i) => isFavouriteSearch(i.key));
  }, [favouriteSearches]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  function filterNavItems(value: string, search: string) {
    const searchValue = search.toLowerCase();
    const item = searchableItems.find((i) => i.key === value);
    if (item && item.searchableText.includes(searchValue)) {
      return 1;
    }
    return 0;
  }
  function toggleFavouriteSearch(item: string) {
    const key = item.split(`${prefix}/`).slice(1).join("/");
    if (key) {
      const favourites = getFavouriteSearches();
      if (!favourites.includes(key)) {
        favourites.push(key);
      } else {
        favourites.splice(favourites.indexOf(key), 1);
      }
      localStorage.setItem("favouriteSearches", JSON.stringify(favourites));
      setFavouriteSearches(favourites);
    }
  }
  function isFavouriteSearch(item: string) {
    const key = item.split(`${prefix}/`).slice(1).join("/");
    if (key) {
      return favouriteSearches.includes(key);
    }
    return false;
  }

  function CustomCommandItem({item}: {item: SearchableNavbarItem}) {
    return (
      <CommandItem
        key={item.key + "-link"}
        value={item.key}
        onSelect={() => {
          router.push("/" + item.href);
          setSearchOpen(false);
        }}
        className="relative !py-1">
        {icons[item.icon as keyof typeof icons]}
        <div className="ml-4 flex flex-col text-left">
          <div className="text-muted-foreground text-xs">{item.route}</div>
          <div className="text-md">{item.displayName}</div>
        </div>

        <Button
          variant="ghost"
          className="z-100 absolute bottom-0 right-2 top-0 m-auto"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavouriteSearch(item.key);
          }}>
          {isFavouriteSearch(item.key) ? (
            <StarFilledIcon className="h-4 w-4 text-blue-400" />
          ) : (
            <Star className="h-4 w-4 text-blue-400" />
          )}
        </Button>
      </CommandItem>
    );
  }
  return (
    <div className="px-2">
      {/* Big Screen */}
      <Button
        variant="outline"
        className="text-muted-foreground relative hidden w-48 rounded-lg border border-gray-300 bg-gray-50 py-1 pl-10 text-sm ring-0 focus:outline-none focus-visible:ring-0 md:block md:w-48 "
        onClick={() => setSearchOpen(true)}>
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-xs">
          <Search className="mr-2 size-4 text-gray-500" />
          Search...
        </div>
        <kbd className="bg-muted text-muted-foreground pointer-events-none absolute bottom-0 right-2 top-0 m-auto inline-flex h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      {/* Small Screen */}
      <Button variant="ghost" onClick={() => setSearchOpen(true)} className="text-muted-foreground p-0 md:hidden">
        <Search className="size-6 text-gray-500" />
      </Button>

      {/* Dialog */}
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogTitle></DialogTitle>
        <Command filter={filterNavItems}>
          <CommandInput placeholder="Type a commond or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {favourites.length > 0 && (
              <CommandGroup heading="Favourites">
                {favourites.map((item) => (
                  <CustomCommandItem key={item.key} item={item} />
                ))}
              </CommandGroup>
            )}
            <CommandSeparator />
            <CommandGroup heading="Links">
              {searchableItems
                .filter((i) => !isFavouriteSearch(i.key))
                .map((item) => (
                  <CustomCommandItem key={item.key} item={item} />
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
}

export default SearchBar;
