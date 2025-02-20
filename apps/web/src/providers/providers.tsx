"use server";

import {getGrantedPoliciesApi, structuredError} from "@repo/utils/api";
import {SessionProvider} from "@repo/utils/auth";
import {auth} from "@repo/utils/auth/next-auth";
import {GrantedPoliciesProvider} from "@repo/utils/policies";
import {isRedirectError} from "next/dist/client/components/redirect";
import NovuProvider from "@/providers/novu";
import {getResourceData} from "@/language-data/core/Default";
import ErrorComponent from "@/app/[lang]/(main)/_components/error-component";
import {getInfoForCurrentTenantApi} from "@/actions/core/AdministrationService/actions";
import {TenantProvider} from "./tenant";

interface ProvidersProps {
  children: JSX.Element;
  lang: string;
}

async function getApiRequests() {
  try {
    const session = await auth();
    const requiredRequests = await Promise.all([getGrantedPoliciesApi(), getInfoForCurrentTenantApi(session)]);

    const optionalRequests = await Promise.allSettled([]);
    return {requiredRequests, optionalRequests};
  } catch (error) {
    if (!isRedirectError(error)) {
      return structuredError(error);
    }
    throw error;
  }
}
export default async function Providers({children, lang}: ProvidersProps) {
  const {languageData} = await getResourceData(lang);
  const session = await auth();
  const apiRequests = await getApiRequests();
  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message} />;
  }
  const [grantedPolicies, tenantData] = apiRequests.requiredRequests;

  return (
    <TenantProvider tenantData={tenantData.data}>
      <SessionProvider session={session}>
        <GrantedPoliciesProvider grantedPolicies={grantedPolicies || {}}>
          <NovuProvider
            appId={process.env.NOVU_APP_IDENTIFIER || ""}
            appUrl={process.env.NOVU_APP_URL || ""}
            subscriberId={session?.user?.novuSubscriberId || "0"}>
            {children}
          </NovuProvider>
        </GrantedPoliciesProvider>
      </SessionProvider>
    </TenantProvider>
  );
}
