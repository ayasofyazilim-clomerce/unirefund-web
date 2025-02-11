import {cn} from "@/lib/utils";

export function TextWithSubText({
  text,
  subText,
  orientation = "horizontal",
  className,
}: {
  text: string;
  subText: string | JSX.Element;
  orientation?: "vertical" | "horizontal";
  className?: string;
}) {
  return (
    <div className={cn("flex text-sm", orientation === "vertical" ? "flex-col" : "gap-2", className)}>
      <span className="text-muted-foreground">{text}</span>
      {subText}
    </div>
  );
}
