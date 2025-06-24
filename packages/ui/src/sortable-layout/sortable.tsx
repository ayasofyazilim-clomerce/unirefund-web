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
import {SortableContext, arraySwap, rectSwappingStrategy, sortableKeyboardCoordinates} from "@dnd-kit/sortable";
import {useCallback, useEffect, useState} from "react";
import {cn} from "../utils";
import {SortableItem} from "./sortable-item";

export type SortableItemProps<T> = {
  id: string;
  order: number;
  className?: string;
  colSpan?: number;
  style?: React.CSSProperties;
} & T;

export function Sortable<T>({
  initalItems,
  getLatestList,
  editable,
  handle,
  renderItem,
  maxColSpan,
}: {
  initalItems: Array<SortableItemProps<T>>;
  getLatestList?: (items: Array<SortableItemProps<T>>) => void;
  editable: boolean;
  handle?: boolean;
  renderItem: (item: SortableItemProps<T>) => JSX.Element;
  maxColSpan: number;
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
          <SortableItem
            key={item.id + item.order + item.colSpan + maxColSpan}
            id={item.order}
            handle={handle}
            colSpan={item.colSpan && item.colSpan > maxColSpan ? maxColSpan : item.colSpan || 1}
            maxColSpan={maxColSpan}
            onItemSizeChange={(size, type) => {
              setItems((items) =>
                items.map((i) =>
                  i.order === item.order ? {...item, ...(type === "col" ? {colSpan: size} : {rowSpan: size})} : i,
                ),
              );
            }}
            editable={editable}
            style={{
              ...item.style,
              gridColumn: `span ${item.colSpan && item.colSpan > maxColSpan ? maxColSpan : item.colSpan || 1} / span ${item.colSpan && item.colSpan > maxColSpan ? maxColSpan : item.colSpan || 1}`,
              // gridRow: `span ${item.rowSpan || 1} / span ${item.rowSpan || 1}`,
            }}
            className={cn(item.className)}>
            {renderItem(item)}
          </SortableItem>
        ))}
      </SortableContext>
      <DragOverlay adjustScale style={{transformOrigin: "0 0 "}}>
        {activeId ? (
          <SortableItem
            maxColSpan={maxColSpan}
            onItemSizeChange={(size, type) => {
              setItems((items) =>
                items.map((i) =>
                  i.order === activeId ? {...i, ...(type === "col" ? {colSpan: size} : {rowSpan: size})} : i,
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
