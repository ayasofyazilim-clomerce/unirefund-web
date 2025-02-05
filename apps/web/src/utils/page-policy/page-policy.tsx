"use server";
import {permanentRedirect, RedirectType} from "next/navigation";
import {getGrantedPoliciesApi} from "src/actions/core/AccountService/actions";
import type {Policy} from "src/utils/page-policy/utils";

export default async function PagePolicy({
  requiredPolicies,
  children,
  lang,
}: {
  requiredPolicies: Policy[];
  children: JSX.Element;
  lang: string;
}) {
  const grantedPolicies = await getGrantedPoliciesApi();

  const missingPolicies = requiredPolicies.filter((policy) => !grantedPolicies?.[policy]);
  if (missingPolicies.length > 0) {
    return permanentRedirect(`/${lang}/unauthorized`, RedirectType.replace);
  }

  return children;
}

export async function isUnauthorized({requiredPolicies, lang}: {requiredPolicies: Policy[]; lang: string}) {
  const grantedPolicies = await getGrantedPoliciesApi();

  const missingPolicies = requiredPolicies.filter((policy) => !grantedPolicies?.[policy]);
  if (missingPolicies.length > 0) {
    return permanentRedirect(`/${lang}/unauthorized`, RedirectType.replace);
  }
  return false;
}
