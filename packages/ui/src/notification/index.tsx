import type { BaseProps as BaseNovuInboxProps, InboxContentProps } from "@novu/react";

export type NotificationProps = {
    appId: string;
    appUrl: string;
    subscriberId: string;
    langugageData: Record<string, string>;
    popoverContentProps?: {
        sideOffset?: number;
        className?: string;
        style?: React.CSSProperties;
    };
    inboxContentProps?: InboxContentProps;
} & Omit<BaseNovuInboxProps, "applicationIdentifier">;

export * from "./inbox";
export * from "./popover";
