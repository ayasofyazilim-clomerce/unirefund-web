"use client";

import {TooltipProvider} from "@repo/ayasofyazilim-ui/molecules/tooltip";

export default function Tooltip({children}: {children: JSX.Element}) {
  return <TooltipProvider>{children}</TooltipProvider>;
}
