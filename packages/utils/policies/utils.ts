"use server";
import { permanentRedirect, RedirectType } from "next/navigation";
import { Policy } from "./types";

export async function isUnauthorized({
  requiredPolicies,
  lang,
  grantedPolicies,
}: {
  requiredPolicies: Policy[];
  lang: string;
  grantedPolicies?: Record<Policy, boolean> | undefined;
}) {
  const missingPolicies = requiredPolicies.filter(
    (policy) => !grantedPolicies?.[policy],
  );
  if (missingPolicies.length > 0) {
    return permanentRedirect(`/${lang}/unauthorized`, RedirectType.replace);
  }
  return false;
}
