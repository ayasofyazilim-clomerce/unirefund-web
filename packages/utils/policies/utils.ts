"use server";
import { permanentRedirect, RedirectType } from "next/navigation";
import { Policy } from "./types";
import { getGrantedPoliciesApi } from "../api/action";
export async function isUnauthorized({
  requiredPolicies,
  lang,
}: {
  requiredPolicies: Policy[];
  lang: string;
}) {
  const grantedPolicies = await getGrantedPoliciesApi();
  const missingPolicies = requiredPolicies.filter(
    (policy) => !grantedPolicies?.[policy],
  );
  if (missingPolicies.length > 0) {
    return permanentRedirect(`/${lang}/unauthorized`, RedirectType.replace);
  }
  return false;
}
