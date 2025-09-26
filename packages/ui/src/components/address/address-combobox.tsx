import * as React from "react";
import {Check, ChevronsUpDown} from "lucide-react";

import type {AddressData, AddressFieldMessages} from "./types";
import {Button} from "@repo/ayasofyazilim-ui/atoms/button";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@repo/ayasofyazilim-ui/atoms/command";
import {Popover, PopoverTrigger, PopoverContent} from "@repo/ayasofyazilim-ui/atoms/popover";
import {cn} from "../../utils";
import {useEffect} from "react";

interface AddressComboboxProps {
  id: string;
  type: "country" | "adminAreaLevel1" | "adminAreaLevel2" | "neighborhood";
  isSuccess: boolean;
  isPending: boolean;
  isError: boolean;
  list: AddressData[] | null | undefined;
  selectLabel: string;
  selectIdentifier: string;
  value: string;
  onValueChange?: (value: string) => void;
  messages?: AddressFieldMessages;
  disabled?: boolean;
}

export function AddressCombobox({
  id,
  type,
  value,
  isSuccess,
  isPending,
  isError,
  list,
  selectLabel,
  selectIdentifier,
  onValueChange,
  disabled = false,
  messages = {
    error: "Error",
    loading: "Loading",
    disabled: "Disabled",
    placeholder: "Please select",
    search: "Search...",
    notFound: "Not found",
  },
}: AddressComboboxProps) {
  const [open, setOpen] = React.useState(false);
  // Find the selected item's label for display
  const selectedItem = list?.find((item) => (item as any)[selectIdentifier] === value);
  const selectedLabel = selectedItem ? (selectedItem as any)[selectLabel] : "";
  if (type === "country") console.log("render");
  useEffect(() => {
    if (value === "00000000-0000-0000-0000-000000000000" && type === "country" && list && list.length > 0) {
      const countryId = localStorage.getItem("countryCode2")?.toUpperCase();
      console.log(selectIdentifier);
      const country = list.find((item) => (item as any)["code2"] === countryId)?.id;
      if (country) {
        onValueChange?.(country);
      }
    }
  }, []);

  if (isError) {
    return (
      <Button
        variant="outline"
        role="combobox"
        disabled
        className="w-full justify-between"
        data-testid={`${id}-trigger`}>
        {messages.error}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    );
  }

  if (isSuccess && list && list.length > 0) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-normal"
            disabled={disabled}
            data-testid={`${id}-trigger`}>
            {selectedLabel || messages.placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder={messages.search} />
            <CommandList>
              <CommandEmpty>{messages.notFound}</CommandEmpty>
              <CommandGroup>
                {list.map((item) => {
                  const itemKey = (item as any)[selectIdentifier] as string;
                  const itemLabel = (item as any)[selectLabel] as string;
                  return (
                    <CommandItem
                      key={itemKey}
                      data-testid={itemKey}
                      value={itemLabel}
                      onSelect={() => {
                        onValueChange?.(itemKey === value ? "" : itemKey);
                        setOpen(false);
                      }}>
                      <Check className={cn("mr-2 h-4 w-4", value === itemKey ? "opacity-100" : "opacity-0")} />
                      {itemLabel}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Button variant="outline" role="combobox" disabled className="w-full justify-between" data-testid={`${id}-trigger`}>
      {isPending ? messages.loading : messages.disabled}
      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  );
}
