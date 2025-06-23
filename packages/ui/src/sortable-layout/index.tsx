"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {SyntheticListenerMap} from "@dnd-kit/core/dist/hooks/utilities";
import {
  SortableContext,
  arraySwap,
  rectSwappingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
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
import {useCallback, useEffect, useState} from "react";
import {cn} from "../utils";

type SortableItemProps<T> = {
  id: string;
  order: number;
  className?: string;
  colSpan?: number;
} & T;

export function SortableLayout<T>({
  items,
  renderItem,
  editMode,
  getLatestList,
  className,
}: {
  items: Array<SortableItemProps<T>>;
  getLatestList?: (items: Array<SortableItemProps<T>>) => void;
  renderItem: (item: SortableItemProps<T>) => JSX.Element;
  editMode: boolean;
  className?: string;
}) {
  return (
    <div className={cn("grid w-full gap-4", className)}>
      <Sortable initalItems={items} getLatestList={getLatestList} handle editable={editMode} renderItem={renderItem} />
    </div>
  );
}

export function Sortable<T>({
  initalItems,
  getLatestList,
  editable,
  handle,
  renderItem,
}: {
  initalItems: Array<SortableItemProps<T>>;
  getLatestList?: (items: Array<SortableItemProps<T>>) => void;
  editable: boolean;
  handle?: boolean;
  renderItem: (item: SortableItemProps<T>) => JSX.Element;
}) {
  const [listItems, setItems] = useState(initalItems.map((item) => ({...item, order: item.order + 1})));
  const [activeId, setActiveId] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as number);
  }, []);
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const {active, over} = event;

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.order === active.id);
        const newIndex = items.findIndex((item) => item.order === over!.id);
        let newArray = arraySwap(items, oldIndex, newIndex).map((item, index) => ({
          ...item,
          order: index + 1,
        }));
        if (getLatestList) getLatestList(newArray);
        return newArray;
      });
    }

    setActiveId(null);
  }, []);
  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  useEffect(() => {
    if (getLatestList) getLatestList(listItems);
  }, [listItems]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragCancel={handleDragCancel}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}>
      <SortableContext items={listItems} strategy={rectSwappingStrategy}>
        {listItems.map((item) => (
          <SortableItem<T>
            key={item.id}
            id={item.order}
            handle={handle}
            colSpan={item.colSpan}
            onItemSizeChange={(size, type) => {
              setItems((items) =>
                items.map((i) =>
                  i.order === item.order ? {...item, className: cn(item.className, `${type}-span-${size}`)} : i,
                ),
              );
            }}
            editable={editable}
            className={cn(item.className)}>
            {renderItem(item)}
          </SortableItem>
        ))}
      </SortableContext>
      <DragOverlay adjustScale style={{transformOrigin: "0 0 "}}>
        {activeId ? (
          <SortableItem<T>
            onItemSizeChange={(size, type) => {
              setItems((items) =>
                items.map((i) =>
                  i.order === activeId ? {...i, className: cn(i.className, `${type}-span-${size}`)} : i,
                ),
              );
            }}
            id={activeId}
            handle={handle}
            editable={editable}
            className={cn(
              "h-full w-full opacity-90 shadow-lg",
              listItems.find((item) => item.order === activeId)?.className,
            )}>
            {renderItem(listItems.find((item) => item.order === activeId)!)}
          </SortableItem>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export function SortableItem<T>({
  id,
  children,
  handle,
  editable = true,
  className,
  onItemSizeChange,
  colSpan = 1,
}: {
  id: string | number;
  children: JSX.Element | string;
  handle?: boolean;
  editable: boolean;
  className?: string;
  colSpan?: number;
  onItemSizeChange: (size: string, type: "col" | "row") => void;
}) {
  const {attributes, isOver, listeners, setNodeRef, transform, transition, isDragging} = useSortable({id});

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(handle ? {} : listeners)}
      tabIndex={handle ? -1 : undefined}
      className={cn(
        `relative overflow-hidden ${editable ? "cursor-default select-none" : "cursor-default select-all"}`,
        isDragging && "opacity-50",
        isOver && "bg-muted",
        className,
      )}>
      {children}
      {handle && editable ? (
        <Controller handle={handle} colSpan={colSpan} listeners={listeners} onItemSizeChange={onItemSizeChange} />
      ) : null}
    </div>
  );
}

function Controller({
  handle,
  colSpan,
  listeners,
  onItemSizeChange,
}: {
  handle: boolean;
  colSpan?: number;
  listeners: SyntheticListenerMap | undefined;
  onItemSizeChange: (size: string, type: "col" | "row") => void;
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
                  setColCount((prev) => Math.min(12, prev + 1));
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
