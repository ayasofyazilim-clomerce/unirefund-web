"use server";

import {getGrantedPoliciesApi} from "@repo/utils/api";
import {SessionProvider} from "@repo/utils/auth";
import {auth} from "@repo/utils/auth/next-auth";
import {GrantedPoliciesProvider} from "@repo/utils/policies";
import type {Policy} from "@repo/utils/policies";

interface ProvidersProps {
  children: JSX.Element;
}
export default async function Providers({children}: ProvidersProps) {
  const session = await auth();
  const grantedPolicies = (await getGrantedPoliciesApi()) as Record<Policy, boolean>;
  return (
    <SessionProvider session={session}>
      <GrantedPoliciesProvider grantedPolicies={grantedPolicies}>{children}</GrantedPoliciesProvider>
    </SessionProvider>
  );
}
