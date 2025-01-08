"use client";
import { SessionProvider } from "next-auth/react";

export default function AuthSession({ children }: { children: JSX.Element }) {
  return <SessionProvider basePath="api/auth">{children}</SessionProvider>;
}
