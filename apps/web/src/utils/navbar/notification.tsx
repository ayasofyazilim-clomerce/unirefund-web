"use client";

import {Button} from "@/components/ui/button";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {toast} from "@/components/ui/sonner";
import {Bell, Inbox, InboxContent} from "@novu/react";
import {} from "lucide-react";
import {useRouter} from "next/navigation";

export function Novu({appId, appUrl, subscriberId}: {appId: string; appUrl: string; subscriberId: string}) {
  const router = useRouter();

  if (!appId || !appUrl || !subscriberId) return null;

  const defaultAppearance = {
    elements: {
      popoverContent: {
        zIndex: 50,
      },
      inboxContent: {},
    },
  };
  return (
    <Inbox
      appearance={defaultAppearance}
      applicationIdentifier={appId}
      backendUrl={appUrl}
      routerPush={(path: string) => {
        router.push(path);
      }}
      subscriberId={subscriberId}>
      <Popover>
        <PopoverTrigger asChild>
          <Button className="relative" size="icon" variant="ghost">
            <Bell />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="h-[500px] overflow-auto  p-0 md:min-w-80">
          <InboxContent
            onNotificationClick={(notification) => {
              // your logic to handle notification click
              toast.success(notification.subject || "");
            }}
            onPrimaryActionClick={(notification) => {
              toast.success(notification.subject || "");
              // your logic to handle primary action click
            }}
            onSecondaryActionClick={(notification) => {
              toast.success(notification.subject || "");
              // your logic to handle secondary action click
            }}
            renderNotification={(notification) => (
              <div>
                <h3>{notification.subject}</h3>
                <p>{notification.body}</p>
                {notification.data?.text ? <p>{notification.data.text as string}</p> : null}
              </div>
            )}
          />
        </PopoverContent>
      </Popover>
    </Inbox>
  );
}
