"use server";

import Toaster from "@repo/ayasofyazilim-ui/molecules/toaster";
import { SessionProvider } from "@repo/utils/auth";
import { GrantedPoliciesProvider } from "@repo/utils/policies";
import type { Session } from "next-auth";
import { getLocalizationResources } from "src/utils";
import type { Policy } from "src/utils/page-policy/utils";
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
  return (
    <>
      <Toaster richColors />
      <SessionProvider session={session}>
        <GrantedPoliciesProvider grantedPolicies={grantedPolicies}>
          <Tooltip>
            <LocaleProvider lang={lang} resources={resources}>
              {children}
            </LocaleProvider>
          </Tooltip>
        </GrantedPoliciesProvider>
      </SessionProvider>
    </>
  );
}
