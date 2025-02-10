"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@repo/ayasofyazilim-ui/atoms/command";
import {CheckIcon} from "lucide-react";
import {useRouter} from "next/navigation";
import NavbarDropdown from "../navbar-dropdown";
import {countries} from "./country-data";
import {DropdownMenuSub} from "@repo/ayasofyazilim-ui/atoms/dropdown-menu";

function LanguageSelector({lang}: {lang: string}) {
  const router = useRouter();
  const selectedLanguageId =
    countries.find((i) => i.cultureName === lang)?.id || "75fe277d-5138-285d-8088-3a1171b61635";

  const selectedLanguage = countries.find((i) => i.id === selectedLanguageId);

  function filterLanguages(value: string, search: string) {
    const searchValue = search.toLowerCase();
    const item = countries.find((i) => i.id === value);
    if (!item) return 0;

    if (item.displayName.toLowerCase().includes(searchValue) || item.cultureName.toLowerCase().includes(searchValue)) {
      return 1;
    }
    return 0;
  }
  return (
    <NavbarDropdown
      title={"Languages"}
      triggerContent={
        <div className="flex items-center">
          <img
            className="h-5 w-5 rounded-full object-cover md:mr-2"
            src={`https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/1x1/${selectedLanguage?.flagIcon}.svg`}
            alt={selectedLanguage?.displayName}
          />
          <span className="hidden md:block">{selectedLanguage?.displayName}</span>
        </div>
      }
      dropdownContent={
        <DropdownMenuSub>
          <Command filter={filterLanguages}>
            <CommandInput placeholder="Filter languages..." autoFocus={true} />
            <CommandList>
              <CommandEmpty>No language found.</CommandEmpty>
              <CommandGroup>
                {countries.map((label) => (
                  <CommandItem
                    key={label.id}
                    value={label.id}
                    onSelect={(value) => {
                      const selected = countries.find((i) => i.id === value);
                      const newUrl = selected?.cultureName + "/" + location.pathname.split("/").slice(2).join("/");
                      router.push("/" + newUrl);
                    }}>
                    {selectedLanguageId === label.id ? (
                      <CheckIcon className="mr-2 h-4 w-4" />
                    ) : (
                      <div className="mr-2 h-4 w-4" />
                    )}
                    <img
                      className="mr-2 h-5 w-5 rounded-full object-cover"
                      src={`https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/1x1/${label.flagIcon}.svg`}
                      alt={label.displayName}
                    />
                    {label.displayName}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </DropdownMenuSub>
      }
    />
  );
}

export default LanguageSelector;
