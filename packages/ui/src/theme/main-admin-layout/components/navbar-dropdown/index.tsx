"use client";
import {Button} from "@repo/ayasofyazilim-ui/atoms/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ayasofyazilim-ui/molecules/dropdown-menu";

import {ChevronDown} from "lucide-react";

function NavbarDropdown({
  triggerContent,
  dropdownContent,
  hideChevron = false,
  size = "md",
  title,
}: {
  triggerContent: JSX.Element;
  dropdownContent: JSX.Element;
  hideChevron?: boolean;
  size?: "sm" | "md" | "lg";
  title?: string;
}) {
  const dropdownSize = size === "md" ? `w-56` : size === "lg" ? "max-w-sm" : `w-40`;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="inline-flex items-center justify-center rounded-lg p-2 text-sm font-medium leading-none text-gray-900 hover:bg-gray-100 focus-visible:ring-0 data-[state=open]:ring-2 data-[state=open]:ring-gray-300">
          <>
            {triggerContent}
            {!hideChevron && <ChevronDown className="ml-1 h-4 w-4" />}
          </>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={dropdownSize}>
        {title && (
          <>
            <div className="block rounded-xl bg-gray-50 px-4 py-2 text-center text-base font-medium text-gray-700">
              {title}
            </div>
            <DropdownMenuSeparator />
          </>
        )}

        {dropdownContent}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default NavbarDropdown;
