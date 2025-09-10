"use client";
import {Button} from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {ChevronDownIcon, PaintbrushVertical, XIcon} from "lucide-react";
import type {Dispatch, SetStateAction} from "react";
import {useState} from "react";
import type {FileServiceResource} from "@/language-data/unirefund/FileService";

export default function FormHeader({
  selectedAction,
  setSelectedAction,
  options,
  showUISchemaWarning,
  languageData,
  disabled,
}: {
  showUISchemaWarning?: boolean;
  languageData: FileServiceResource;
} & ActionProps) {
  const [overrideshowUISchemaWarning, setOverrideShowUISchemaWarning] = useState(true);
  return (
    <div className="sticky top-0 z-10  mb-2 flex items-center gap-2 border-b bg-white pb-2 pt-2 md:pt-0">
      {overrideshowUISchemaWarning && showUISchemaWarning ? (
        <div className="flex w-full gap-2 rounded-md border border-orange-400 bg-orange-50 p-2 text-xs text-orange-500">
          <PaintbrushVertical className="h-4 w-4" />
          <span className="col-start-2">{languageData["Verification.NoUISchemaDefined"]}</span>
          <XIcon
            className="ml-auto size-4 cursor-pointer"
            onClick={() => {
              setOverrideShowUISchemaWarning(false);
            }}
            type="button"
          />
        </div>
      ) : null}
      <Actions
        disabled={disabled}
        options={options}
        selectedAction={selectedAction}
        setSelectedAction={setSelectedAction}
      />
    </div>
  );
}

export type ActionOption = {
  key: string;
  label: string;
  description?: string;
};
type ActionProps = {
  disabled?: boolean;
  selectedAction: ActionOption;
  setSelectedAction: Dispatch<SetStateAction<ActionOption>>;
  options: ActionOption[];
};

function Actions({disabled, selectedAction, setSelectedAction, options}: ActionProps) {
  return (
    <div className="shadow-xs ml-auto inline-flex rounded-md rtl:space-x-reverse">
      <Button
        className="rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10"
        data-testid={`${selectedAction.key}_button`}
        variant="outline">
        {selectedAction.label}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild data-testid={`${selectedAction.key}_menu_button`}>
          <Button
            aria-label="Options"
            className="rounded-none border-l-0 shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10"
            data-testid={`${selectedAction.key}_trigger_button`}
            disabled={disabled}
            size="icon"
            type="button"
            variant="outline">
            <ChevronDownIcon aria-hidden="true" size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="max-w-64 md:max-w-xs" side="bottom" sideOffset={4}>
          <DropdownMenuRadioGroup
            onValueChange={(value) => {
              const selected = options.find((option) => option.key === value);
              if (selected) {
                setSelectedAction(selected);
              }
            }}
            value={selectedAction.key}>
            {options.map((option, index) => (
              <DropdownMenuRadioItem
                className="items-start [&>span]:pt-1.5"
                data-testid={`actions_${index}`}
                key={option.key}
                value={option.key}>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">{option.label}</span>
                  <span className="text-muted-foreground text-xs">{option.description}</span>
                </div>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
