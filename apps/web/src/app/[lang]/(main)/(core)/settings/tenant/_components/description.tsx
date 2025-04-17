import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

export function description(text: string) {
  if (!text) return null;

  // Mobil cihazlar için daha kısa metin, büyük ekranlar için daha uzun metin
  const shortLimit = 50;

  if (text.length < shortLimit) {
    return <div className="text-muted-foreground break-words text-xs sm:text-sm">{text}</div>;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="text-muted-foreground line-clamp-2 cursor-help break-words text-xs sm:text-sm">{text}</div>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs sm:max-w-sm md:max-w-md">
        <p className="text-xs sm:text-sm">{text}</p>
      </TooltipContent>
    </Tooltip>
  );
}
