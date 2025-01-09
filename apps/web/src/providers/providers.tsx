"use server";

import Toaster from "@repo/ayasofyazilim-ui/molecules/toaster";
import type { Session } from "next-auth";
import { getLocalizationResources } from "src/utils";
import type { Policy } from "src/utils/page-policy/utils";
import { ApplicationProvider } from "./application";
import { SessionProvider } from "./session";
import { ConfigProvider } from "./configuration";
import { GrantedPoliciesProvider } from "./granted-policies";
import { LocaleProvider } from "./locale";
import Tooltip from "./tooltip";

interface ProvidersProps {
  children: JSX.Element;
  lang: string;
  grantedPolicies: Record<Policy, boolean> | undefined;
  session: Session | null;
}
export default async function Providers({
  children,
  lang,
  grantedPolicies,
  session,
}: ProvidersProps) {
  const resources = await getLocalizationResources(lang);
  const appName = process.env.APPLICATION_NAME || "UNIREFUND";
  return (
    <>
      <Toaster richColors />
      <ApplicationProvider appName={appName}>
        <SessionProvider session={session}>
          <GrantedPoliciesProvider grantedPolicies={grantedPolicies}>
            <ConfigProvider>
              <Tooltip>
                <LocaleProvider lang={lang} resources={resources}>
                  {children}
                </LocaleProvider>
              </Tooltip>
            </ConfigProvider>
          </GrantedPoliciesProvider>
        </SessionProvider>
      </ApplicationProvider>
    </>
  );
}
