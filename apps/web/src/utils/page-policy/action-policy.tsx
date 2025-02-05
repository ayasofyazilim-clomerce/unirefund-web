"use client";
import type {Policy} from "src/utils/page-policy/utils";

export default function isActionGranted(
  requiredPolicies: Policy[],
  grantedPolicies: Record<Policy, boolean> | undefined,
) {
  const missingPolicies = requiredPolicies.filter((policy) => !grantedPolicies?.[policy]);
  if (missingPolicies.length > 0) {
    return false;
  }
  return true;
}
