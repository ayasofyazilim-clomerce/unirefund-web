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
import {
  SortableContext,
  arrayMove,
  arraySwap,
  rectSortingStrategy,
  rectSwappingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {Button} from "@repo/ayasofyazilim-ui/atoms/button";
import {GripVertical} from "lucide-react";
import {useCallback, useState} from "react";
import {cn} from "../utils";

type Item<T> = {
  id: string;
  order: number;
  className?: string;
} & T;

export function SortableLayout<T>({
  items,
  renderItem,
  editMode,
  getLatestList,
  className,
}: {
  items: Array<Item<T>>;
  getLatestList?: (items: Array<Item<T>>) => void;
  renderItem: (item: Item<T>) => JSX.Element;
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
  initalItems: Array<Item<T>>;
  getLatestList?: (items: Array<Item<T>>) => void;
  editable: boolean;
  handle?: boolean;
  renderItem: (item: Item<T>) => JSX.Element;
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

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragCancel={handleDragCancel}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}>
      <SortableContext items={listItems} strategy={rectSwappingStrategy}>
        {listItems.map((item) => (
          <SortableItem key={item.id} id={item.order} handle={handle} editable={editable} className={item.className}>
            {renderItem(item)}
          </SortableItem>
        ))}
      </SortableContext>
      <DragOverlay adjustScale style={{transformOrigin: "0 0 "}}>
        {activeId ? (
          <SortableItem
            id={activeId}
            handle={handle}
            editable={editable}
            className="h-full w-full opacity-90 shadow-lg">
            {renderItem(listItems.find((item) => item.order === activeId)!)}
          </SortableItem>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export function SortableItem({
  id,
  children,
  handle,
  editable = true,
  className,
}: {
  id: string | number;
  children: JSX.Element | string;
  handle?: boolean;
  editable: boolean;
  className?: string;
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
        <Button
          {...(handle ? listeners : {})}
          variant={"secondary"}
          className="absolute right-2 top-2 z-10 h-6 w-6 cursor-grab px-0">
          <GripVertical className="text-muted-foreground w-4" />
        </Button>
      ) : null}
    </div>
  );
}
