"use client";

import { Policy } from "./types";

export default function isActionGranted(
  requiredPolicies: Policy[],
  grantedPolicies: Record<Policy, boolean> | undefined,
) {
  const missingPolicies = requiredPolicies.filter(
    (policy) => !grantedPolicies?.[policy],
  );
  if (missingPolicies.length > 0) {
    return false;
  }
  return true;
}
