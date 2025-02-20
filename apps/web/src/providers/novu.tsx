"use client";

import {NovuProvider as Novu} from "@novu/react";

export default function NovuProvider({
  children,
  appId,
  subscriberId,
  appUrl,
}: {
  children: React.ReactNode;
  appId: string;
  subscriberId: string;
  appUrl: string;
}) {
  if (!appId || !appUrl || !subscriberId) return children;
  return (
    <Novu applicationIdentifier={appId} backendUrl={appUrl} subscriberId={subscriberId}>
      {children}
    </Novu>
  );
}
