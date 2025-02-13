"use server";

import Toaster from "@repo/ayasofyazilim-ui/molecules/toaster";
import {SessionProvider} from "@repo/utils/auth";
import type {Policy} from "@repo/utils/policies";
import {GrantedPoliciesProvider} from "@repo/utils/policies";
import type {Session} from "next-auth";
import {getGrantedPoliciesApi} from "@repo/utils/api";
import {getLocalizationResources} from "src/utils";
import {LocaleProvider} from "./locale";
import Tooltip from "./tooltip";

interface ProvidersProps {
  children: JSX.Element;
  lang: string;
  session: Session | null;
}
export default async function Providers({children, lang, session}: ProvidersProps) {
  const resources = await getLocalizationResources(lang);
  const grantedPolicies = (await getGrantedPoliciesApi()) as Record<Policy, boolean>;
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
