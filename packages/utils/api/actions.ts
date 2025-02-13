"use server";
import {getAccountServiceClient} from "../auth/auth-actions";
import {auth} from "../auth/auth";

export async function getGrantedPoliciesApi() {
  try {
    const session = await auth();
    const client = await getAccountServiceClient(session?.user?.access_token);
    const response = await client.abpApplicationConfiguration.getApiAbpApplicationConfiguration();
    const grantedPolicies = response.auth?.grantedPolicies;
    return grantedPolicies;
  } catch (error) {
    return undefined;
  }
}
