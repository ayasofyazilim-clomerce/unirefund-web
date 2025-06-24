import {Button} from "@repo/ayasofyazilim-ui/atoms/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@repo/ayasofyazilim-ui/atoms/sheet";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@repo/ayasofyazilim-ui/atoms/tabs";
import {RadioGroup, RadioGroupItem} from "@repo/ayasofyazilim-ui/atoms/radio-group";
import {ChevronDownIcon, ChevronUpIcon, LayoutDashboard} from "lucide-react";
import {cn} from "../utils";
import {Label} from "@repo/ayasofyazilim-ui/atoms/label";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {Layout} from "./";

export function CustomizeDashboard({
  layout,
  setLayout,
  saveLayout,
}: {
  layout: Layout;
  setLayout: Dispatch<SetStateAction<Layout>>;
  saveLayout?: () => void;
}) {
  const [colCount, setColCount] = useState(layout?.cols || 3);
  useEffect(() => {
    setLayout((prev) => {
      if (prev) {
        return {
          ...prev,
          cols: colCount,
        };
      }
      return {
        cols: colCount,
      };
    });
  }, [colCount]);
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size={"icon"} className="ml-auto min-h-9 min-w-9">
          <LayoutDashboard className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="grid grid-rows-[auto_1fr_auto]">
        <SheetHeader>
          <SheetTitle>Edit dashboard</SheetTitle>
          <SheetDescription>Make changes to your dashboard here. Click save when you&apos;re done.</SheetDescription>
        </SheetHeader>
        <div>
          <div className="flex items-center justify-between gap-4">
            <Label>Column count</Label>
            <div className="shadow-xs inline-flex -space-x-px rounded-md rtl:space-x-reverse">
              <Button
                className="min-w-9 rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10"
                variant="outline"
                size="icon"
                onClick={() => setColCount((prev) => Math.min(12, prev + 1))}
                aria-label="Upvote">
                <ChevronUpIcon size={16} aria-hidden="true" />
              </Button>
              <span className="border-input flex w-full min-w-9 max-w-9 items-center justify-center border px-3 text-sm font-medium">
                {colCount}
              </span>
              <Button
                className="min-w-9 rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10"
                variant="outline"
                size="icon"
                onClick={() => setColCount((prev) => Math.max(1, prev - 1))}
                aria-label="Downvote">
                <ChevronDownIcon size={16} aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
        <SheetFooter>
          {saveLayout && (
            <Button
              type="button"
              onClick={() => {
                saveLayout();
              }}>
              Save changes
            </Button>
          )}
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function Container({
  id,
  children,
  classNames,
  itemCount = 6,
}: {
  id: string;
  children?: React.ReactNode;
  classNames?: Record<number, string>;
  itemCount?: number;
}) {
  const items = Array.from({length: itemCount}, (_, i) => i);
  return (
    <div>
      <RadioGroupItem id={id} value={id} className="peer hidden" />
      <Label
        className={cn(
          "bg-muted grid aspect-video grid-cols-3 gap-1 rounded-md p-1 ring-green-500/50 peer-aria-checked:ring",
        )}
        htmlFor={id}>
        {items.map((i) => (
          <Item key={i} className={classNames?.[i]} />
        ))}
      </Label>
    </div>
  );
}
function Item({className}: {className?: string}) {
  return <div className={cn("rounded-md bg-white shadow-sm", className)} />;
}
