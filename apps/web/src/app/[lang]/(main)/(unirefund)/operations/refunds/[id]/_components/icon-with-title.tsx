import {cn} from "@/lib/utils";
import type {ComponentType} from "react";

export function IconWithTitle({
  icon: Icon,
  title,
  classNames,
}: {
  icon: ComponentType<{
    className?: string;
  }>;
  title: string;
  classNames?: {
    icon?: string;
    title?: string;
    container?: string;
  };
}) {
  return (
    <div className={cn("flex items-center gap-2", classNames?.container)}>
      <Icon className={cn("size-6", classNames?.icon)} />
      <h3 className={cn("text-xl font-bold", classNames?.title)}>{title}</h3>
    </div>
  );
}
