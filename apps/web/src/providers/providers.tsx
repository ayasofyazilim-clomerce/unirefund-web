"use server";

import {isRedirectError} from "next/dist/client/components/redirect";
import {getGrantedPoliciesApi, structuredError} from "@repo/utils/api";
import {SessionProvider} from "@repo/utils/auth";
import {auth} from "@repo/utils/auth/next-auth";
import {GrantedPoliciesProvider} from "@repo/utils/policies";
import type {Policy} from "@repo/utils/policies";
import NotFound from "@/app/[lang]/(main)/not-found";
import {getInfoForCurrentTenantApi} from "@/actions/core/AdministrationService/actions";
import {TenantProvider} from "./tenant";

interface ProvidersProps {
  children: JSX.Element;
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
export default async function Providers({children}: ProvidersProps) {
  const session = await auth();
  const apiRequests = await getApiRequests();
  if ("message" in apiRequests) {
    return <NotFound />;
  }
  const [grantedPolicies, tenantData] = apiRequests.requiredRequests;

  return (
    <TenantProvider tenantData={tenantData.data}>
      <SessionProvider session={session}>
        <GrantedPoliciesProvider grantedPolicies={grantedPolicies as Record<Policy, boolean>}>
          {children}
        </GrantedPoliciesProvider>
      </SessionProvider>
    </TenantProvider>
  );
}
