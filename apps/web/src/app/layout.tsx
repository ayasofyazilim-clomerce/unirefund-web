"use server";
import { auth } from "@repo/utils/auth/next-auth";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import Providers from "src/providers/providers";
import "./globals.css";
import { Suspense } from "react";

interface RootLayoutProps {
  params: { lang: string };
  children: JSX.Element;
}
const appName = process.env.APPLICATION_NAME || "UNIREFUND";
const title = appName.charAt(0).toUpperCase() + appName.slice(1).toLowerCase();
export async function generateMetadata(): Promise<Metadata> {
  await Promise.resolve();
  return {
    title,
    description:
      "Core project is a core web app for managing multi-tenant apps.",
  };
}
export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { lang } = params;
  const session = await auth();
  return (
    <html className="h-full overflow-hidden" lang={lang}>
      <body className={GeistSans.className} data-app-name={appName}>
        <Suspense fallback={<div>Loading...</div>}>
          <Providers lang={lang} session={session}>
            {children}
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}
