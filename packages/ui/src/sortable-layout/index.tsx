"use client";

import {Sortable} from "./sortable";
import {cn} from "../utils";
import {SortableItemProps} from "./sortable";

export function SortableLayout<T>({
  items,
  renderItem,
  editMode,
  getLatestList,
  className,
  maxColSpan = 12,
  style,
}: {
  items: Array<SortableItemProps<T>>;
  getLatestList?: (items: Array<SortableItemProps<T>>) => void;
  renderItem: (item: SortableItemProps<T>) => JSX.Element;
  editMode: boolean;
  className?: string;
  maxColSpan?: number;
  style?: React.CSSProperties;
}) {
  return (
    <div className={cn("grid w-full gap-4", className)} style={style}>
      <Sortable
        initalItems={items}
        getLatestList={getLatestList}
        handle
        editable={editMode}
        renderItem={renderItem}
        maxColSpan={maxColSpan}
      />
    </div>
  );
}
