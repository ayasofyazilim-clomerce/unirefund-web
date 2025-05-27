"use client";
import {Button} from "@/components/ui/button";
import type {UniRefund_FileService_Files_FileForHumanValidationDto as FileForHumanValidationDto} from "@ayasofyazilim/saas/FileService";
import {Combobox} from "@repo/ayasofyazilim-ui/molecules/combobox";
import {ChevronDownIcon} from "lucide-react";
import type {Dispatch, SetStateAction} from "react";
import {useState} from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function FormHeader({
  fileList,
  selectedFile,
  selectedAction,
  setSelectedAction,
  options,
}: {
  fileList: FileForHumanValidationDto[];
  selectedFile?: string;
} & ActionProps) {
  const [selected, setSelected] = useState<FileForHumanValidationDto | null | undefined>(
    fileList.find((item) => item.id === selectedFile),
  );
  return (
    <div className="sticky top-0  z-10 mb-2 grid grid-cols-2 items-center gap-2 border-b bg-white pb-2 pt-2 md:flex md:pt-0">
      <Combobox<FileForHumanValidationDto>
        badges={{
          fileHumanValidationStatus: {
            className: "text-xs",
            label: (item) => item.fileHumanValidationStatus,
          },
        }}
        classNames={{
          container: "max-w-lg overflow-hidden",
        }}
        list={fileList}
        onValueChange={setSelected}
        selectIdentifier="id"
        selectLabel="id"
        value={selected}
      />
      <Actions options={options} selectedAction={selectedAction} setSelectedAction={setSelectedAction} />
    </div>
  );
}

export type ActionOption = {
  key: string;
  label: string;
  description?: string;
};
type ActionProps = {
  selectedAction: ActionOption;
  setSelectedAction: Dispatch<SetStateAction<ActionOption>>;
  options: ActionOption[];
};

function Actions({selectedAction, setSelectedAction, options}: ActionProps) {
  return (
    <div className=" shadow-xs ml-auto inline-flex rounded-md rtl:space-x-reverse">
      <Button
        className="rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10"
        variant="outline">
        {selectedAction.label}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label="Options"
            className="rounded-none border-l-0 shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10"
            size="icon"
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
            {options.map((option) => (
              <DropdownMenuRadioItem className="items-start [&>span]:pt-1.5" key={option.key} value={option.key}>
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
