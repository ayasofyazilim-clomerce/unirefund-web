"use client";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { Badge } from "@repo/ayasofyazilim-ui/atoms/badge";
import { Button } from "@repo/ayasofyazilim-ui/atoms/button";
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
import { DialogTitle } from "@repo/ayasofyazilim-ui/atoms/dialog";
import { NavbarItemsFromDB } from "@repo/ui/theme/types";
import { Search, Star, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { icons } from "../navbar";

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
type DBSearchResult = {
  title: string;
  key: string;
  icon: string;
  items: { href: string; name: string; id: string; searchableText: string }[];
};
let timeout: NodeJS.Timeout;

export type SearchFromDB = {
  key: string;
  title: string;
  icon: string;
  search: (search: string) => Promise<{ id: string; name: string; href: string }[]>;
};

function SearchBar({
  navbarItems,
  prefix,
  searchFromDB,
}: {
  navbarItems: NavbarItemsFromDB[];
  prefix: string;
  searchFromDB: SearchFromDB[];
}) {
  const [searchValue, setSearchValue] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedSearchableItem, setSelectedSearchableItem] = useState<SearchFromDB | null>(null);
  const [isSearchableItemsVisible, setIsSearchableItemsVisible] = useState(false);
  const [dbSearchResults, setDbSearchResults] = useState<DBSearchResult | null>();
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

  function searchDB(search: string) {
    clearTimeout(timeout);
    if (!selectedSearchableItem) return;

    const searchValue = search.trim();
    if (searchValue.length > 0) {
      timeout = setTimeout(() => {
        selectedSearchableItem.search(searchValue).then((res) => {
          setDbSearchResults({
            title: selectedSearchableItem.title,
            key: selectedSearchableItem.key,
            icon: selectedSearchableItem.icon,
            items: res.map((i) => ({
              id: i.id,
              name: i.name,
              href: i.href,
              searchableText: `${selectedSearchableItem.key}: ${i.name}`,
            })),
          });
        });
      }, 400);
    }
  }
  function filterNavItems(value: string, search: string) {
    const searchValue = search.toLowerCase();
    if (searchValue.length > 0 && searchValue[0] === ":") {
      const filteredSearchValue = searchValue.slice(1);
      const item = searchFromDB.find((i) => i.key === value);
      if (item && item.title.toLocaleLowerCase().includes(filteredSearchValue)) {
        return 1;
      }
      return 0;
    }
    const item = searchableItems.find((i) => i.key === value);
    if (item && item.searchableText.includes(searchValue)) {
      return 1;
    }
    if (dbSearchResults?.items.find((i) => i.id === value)) {
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
  function CustomCommandItem({ item }: { item: SearchableNavbarItem }) {
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
  function CustomItem({ item }: { item: SearchFromDB }) {
    return (
      <CommandItem
        key={item.key + "-link"}
        value={item.key}
        onSelect={() => {
          clearSearch();
          setSelectedSearchableItem(item);
        }}
        keywords={[":" + item.key]}
        className="relative !py-1">
        {icons[item.icon as keyof typeof icons]}
        <div className="ml-4 flex flex-col text-left">
          <div className="text-md">{item.title}</div>
        </div>
      </CommandItem>
    );
  }
  function onSearchValueChange(value: string) {
    if (value === ":") {
      setIsSearchableItemsVisible(true);
    }
    setSearchValue(value);
    searchDB(value);
  }

  function clearSearch() {
    setSelectedSearchableItem(null);
    setIsSearchableItemsVisible(false);
    setSearchValue("");
    setDbSearchResults(null);
  }
  return (
    <div className="w-full md:w-auto">
      <Button
        variant="outline"
        className="text-muted-foreground relative rounded-lg border border-gray-300 bg-gray-50 py-1 pl-10 text-sm ring-0 focus:outline-none focus-visible:ring-0 w-full md:w-auto md:w-96"
        onClick={() => setSearchOpen(true)}>
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-xs">
          <Search className="mr-2 size-4 text-gray-500" />
          Search...
        </div>
        <kbd className="bg-muted text-muted-foreground pointer-events-none absolute bottom-0 right-2 top-0 m-auto inline-flex h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>


      {/* Dialog */}
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogTitle></DialogTitle>
        <Command filter={filterNavItems}>
          {selectedSearchableItem && (
            <div className="mx-2 mb-2 mt-3 flex items-center">
              <Badge variant={"secondary"} className="">
                {selectedSearchableItem.title}
                <Button variant="link" className="m-0 ml-2 h-min p-0 text-black" onClick={clearSearch}>
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            </div>
          )}

          <CommandInput
            placeholder="Type to search or type : to see commands"
            onValueChange={(s) => onSearchValueChange(s)}
            onKeyDown={(s) => {
              if (s.key === "Backspace" && searchValue === ":") {
                setIsSearchableItemsVisible(false);
                return;
              }
              if (s.key === "Backspace" && selectedSearchableItem && searchValue.length === 0) {
                setSelectedSearchableItem(null);
                setDbSearchResults(null);
                setIsSearchableItemsVisible(false);
              }
            }}
            value={searchValue}
          />
          <CommandList>
            {!selectedSearchableItem && <CommandEmpty>No results found.</CommandEmpty>}

            {favourites.length > 0 && (
              <CommandGroup heading="Favourites">
                {favourites.map((item) => (
                  <CustomCommandItem key={item.key} item={item} />
                ))}
              </CommandGroup>
            )}
            <CommandSeparator />
            {dbSearchResults && (
              <CommandGroup heading={dbSearchResults.title}>
                {dbSearchResults.items.map((item) => (
                  <CustomCommandItem
                    key={item.id}
                    item={{
                      key: item.id,
                      icon: dbSearchResults.icon,
                      displayName: item.name,
                      href: item.href,
                      route: "",
                      searchableText: item.searchableText.toLowerCase(),
                    }}
                  />
                ))}
              </CommandGroup>
            )}
            {isSearchableItemsVisible && (
              <CommandGroup heading="Commands">
                {searchFromDB.map((item) => (
                  <CustomItem key={item.key} item={item} />
                ))}
              </CommandGroup>
            )}
            {!isSearchableItemsVisible && !selectedSearchableItem && (
              <>
                <CommandGroup heading="Links">
                  {searchableItems
                    .filter((i) => !isFavouriteSearch(i.key))
                    .map((item) => (
                      <CustomCommandItem key={item.key} item={item} />
                    ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
}

export default SearchBar;
