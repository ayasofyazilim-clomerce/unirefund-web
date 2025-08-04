import {ScrollBar} from "@repo/ayasofyazilim-ui/atoms/scroll-area";
import {toast} from "@repo/ayasofyazilim-ui/atoms/sonner";
import ScrollArea from "@repo/ayasofyazilim-ui/molecules/scroll-area";
import {Copy} from "lucide-react";

export function toastOnSubmit(data: string | object) {
  toast.message("You submitted the following values:", {
    classNames: {
      content: "w-full",
      description: "w-full h-full",
      actionButton: "absolute top-4 right-2",
    },
    description: (
      <>
        <pre className="mt-2 flex h-full w-full flex-1  flex-col overflow-auto rounded-md bg-slate-950">
          <ScrollArea>
            <code className="flex max-h-[50dvh] min-h-[500px] p-4 pb-6 text-white">
              {JSON.stringify(data, null, 2)}
            </code>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <p className="text-muted-foreground pl-4">This submit was not connected to an API.</p>
        </pre>
      </>
    ),
    action: {
      label: <Copy className="h-4 w-4" />,
      onClick: () => {
        navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      },
    },
    duration: 99999,
  });
}
