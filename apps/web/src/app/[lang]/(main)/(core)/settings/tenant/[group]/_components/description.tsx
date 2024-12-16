import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function description(text: string) {
  if (!text) return text;
  if (text.length < 100)
    return <div className="text-muted-foreground text-sm">{text}</div>;
  return (
    <Tooltip>
      <TooltipTrigger className="text-muted-foreground">
        {`${text.substring(0, 100)}...`}
      </TooltipTrigger>
      <TooltipContent>{text}</TooltipContent>
    </Tooltip>
  );
}
