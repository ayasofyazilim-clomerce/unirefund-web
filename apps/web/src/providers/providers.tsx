"use server";

import Toaster from "@repo/ayasofyazilim-ui/molecules/toaster";
import { getLocalizationResources } from "src/utils";
import { auth } from "auth";
import AuthSession from "./auth";
import { ConfigProvider } from "./configuration";
import { LocaleProvider } from "./locale";
import { GrantedPoliciesProvider } from "./granted-policies";
import { ApplicationProvider } from "./application";
import Tooltip from "./tooltip";

interface ProvidersProps {
  children: JSX.Element;
  lang: string;
}
export default async function Providers({ children, lang }: ProvidersProps) {
  const resources = await getLocalizationResources(lang);
  const sessions = await auth();
  const grantedPolicies = sessions?.grantedPolicies;

  const appName = process.env.APPLICATION_NAME || "UNIREFUND";
  return (
    <>
      <Toaster richColors />
      <ApplicationProvider appName={appName}>
        <AuthSession>
          <GrantedPoliciesProvider grantedPolicies={grantedPolicies}>
            <ConfigProvider>
              <Tooltip>
                <LocaleProvider lang={lang} resources={resources}>
                  {children}
                </LocaleProvider>
              </Tooltip>
            </ConfigProvider>
          </GrantedPoliciesProvider>
        </AuthSession>
      </ApplicationProvider>
    </>
  );
}
