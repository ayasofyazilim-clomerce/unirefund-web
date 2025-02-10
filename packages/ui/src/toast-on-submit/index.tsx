import {ScrollBar} from "@repo/ayasofyazilim-ui/atoms/scroll-area";
import {toast} from "@repo/ayasofyazilim-ui/atoms/sonner";
import ScrollArea from "@repo/ayasofyazilim-ui/molecules/scroll-area";
import {Copy} from "lucide-react";

export function toastOnSubmit(data: string | object) {
  toast("You submitted the following values:", {
    classNames: {
      content: "w-full",
      description: "w-full h-full",
      actionButton: "absolute top-4 right-2",
    },
    description: (
      <>
        <pre className="mt-2 h-full w-full flex-1 rounded-md bg-slate-950 p-4">
          <ScrollArea>
            <code className=" text-white">{JSON.stringify(data, null, 2)}</code>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <p className="text-muted-foreground">This submit was not connected to an API.</p>
        </pre>
      </>
    ),
    action: {
      label: <Copy className="h-4 w-4" />,
      onClick: () => {
        navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      },
    },
  });
}
