import {SyntheticListenerMap} from "@dnd-kit/core/dist/hooks/utilities";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {Button} from "@repo/ayasofyazilim-ui/atoms/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ayasofyazilim-ui/atoms/dropdown-menu";
import {ChevronDownIcon, ChevronUpIcon, GripVertical, MoreVertical} from "lucide-react";
import {cn} from "../utils";
import {useEffect, useState} from "react";

export function SortableItem({
  id,
  children,
  handle,
  editable = true,
  className,
  onItemSizeChange,
  colSpan = 1,
  maxColSpan,
  style: initialStyle,
}: {
  id: string | number;
  children: JSX.Element | string;
  handle?: boolean;
  editable: boolean;
  className?: string;
  colSpan?: number;
  maxColSpan: number;
  onItemSizeChange: (size: string, type: "col" | "row") => void;
  style?: React.CSSProperties;
}) {
  const {attributes, isOver, listeners, setNodeRef, transform, transition, isDragging} = useSortable({id});

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...initialStyle,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(handle ? {} : listeners)}
      tabIndex={handle ? -1 : undefined}
      className={cn(
        `relative min-h-max overflow-hidden ${editable ? "cursor-default select-none" : "cursor-default select-all"}`,
        isDragging && "opacity-50",
        isOver && "bg-muted",
        className,
      )}>
      {children}
      {handle && editable ? (
        <Controller
          handle={handle}
          colSpan={colSpan}
          listeners={listeners}
          maxColSpan={maxColSpan}
          onItemSizeChange={onItemSizeChange}
        />
      ) : null}
    </div>
  );
}

function Controller({
  handle,
  colSpan,
  listeners,
  onItemSizeChange,
  maxColSpan,
}: {
  handle: boolean;
  colSpan?: number;
  listeners: SyntheticListenerMap | undefined;
  onItemSizeChange: (size: string, type: "col" | "row") => void;
  maxColSpan: number;
}) {
  // return (
  //   <Button variant={"ghost"} size={"icon"} className="absolute right-2 top-2 z-10" {...(handle ? listeners : {})}>
  //     <GripVertical className="w-4" />
  //   </Button>
  // );
  const [colCount, setColCount] = useState(colSpan || 1);
  useEffect(() => {
    onItemSizeChange(colCount.toString(), "col");
  }, [colCount]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="absolute right-2 top-2 z-10 h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem {...(handle ? listeners : {})}>
          <GripVertical className="w-4" />
          <span className="ml-2">Hold to reorder</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="" asChild>
          <div className="flex items-center gap-2 text-nowrap">
            Column span
            <div className="shadow-xs inline-flex w-full -space-x-px rounded-md rtl:space-x-reverse">
              <Button
                className="min-w-9 rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10"
                variant="outline"
                size="icon"
                onClick={(e) => {
                  e.preventDefault();
                  setColCount((prev) => Math.max(1, prev - 1));
                }}
                aria-label="Downvote">
                <ChevronDownIcon size={16} aria-hidden="true" />
              </Button>
              <span className="border-input flex w-full min-w-9 items-center justify-center border px-3 text-sm font-medium">
                {colCount}
              </span>
              <Button
                className="min-w-9 rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10"
                variant="outline"
                size="icon"
                onClick={(e) => {
                  e.preventDefault();
                  setColCount((prev) => Math.min(maxColSpan, prev + 1));
                }}
                aria-label="Upvote">
                <ChevronUpIcon size={16} aria-hidden="true" />
              </Button>
            </div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
