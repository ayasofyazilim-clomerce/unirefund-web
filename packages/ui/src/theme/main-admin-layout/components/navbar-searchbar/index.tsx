"use client";
import {Button} from "@repo/ayasofyazilim-ui/atoms/button";
import {Search, Star} from "lucide-react";
import {useEffect, useMemo, useState} from "react";

import {StarFilledIcon} from "@radix-ui/react-icons";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@repo/ayasofyazilim-ui/atoms/command";
import {NavbarItemsFromDB} from "@repo/ui/theme/types";
import {useRouter} from "next/navigation";
import {icons} from "../navbar";
import {DialogTitle} from "@repo/ayasofyazilim-ui/atoms/dialog";

function getFavouriteSearches() {
  if (typeof window === "undefined") return [];

  const cat = localStorage.getItem("favouriteSearches");
  if (cat) {
    return JSON.parse(cat);
  }
  return [];
}

function SearchBar({navbarItems, prefix}: {navbarItems: NavbarItemsFromDB[]; prefix: string}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [favouriteSearches, setFavouriteSearches] = useState(getFavouriteSearches());
  const router = useRouter();

  const favourites = useMemo(() => {
    return navbarItems.filter((i) => isFavouriteSearch(i.key));
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
    const item = navbarItems.find((i) => i.key === value);
    if (!item) return 0;

    if (item.displayName.toLowerCase().includes(searchValue) || item.description.toLowerCase().includes(searchValue)) {
      return 1;
    }
    return 0;
  }
  function toggleFavouriteSearch(item: string) {
    const key = item.split(prefix + "/")?.[1];
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
    const key = item.split(prefix + "/")?.[1];
    if (key) {
      return favouriteSearches.includes(key);
    }
    return false;
  }

  function CustomCommandItem({item, detailed}: any) {
    return (
      <CommandItem
        key={item.key + "-link"}
        value={item.key}
        onSelect={() => {
          router.push("/" + item.href);
          setSearchOpen(false);
        }}
        className="relative">
        {icons[item.icon as keyof typeof icons]}
        <div className="ml-4 flex flex-col text-left">
          <div className="text-md">{item.displayName}</div>
          {detailed && <div className="text-muted-foreground text-xs">{item.description}</div>}
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
                  <CustomCommandItem key={item.key} item={item} detailed={false} />
                ))}
              </CommandGroup>
            )}
            <CommandSeparator />
            <CommandGroup heading="Links">
              {navbarItems.map((item) => (
                <CustomCommandItem key={item.key} item={item} detailed={true} />
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
}

export default SearchBar;
