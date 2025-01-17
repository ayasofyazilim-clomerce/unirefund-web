"use client";
import React from "react";
import type { ReactNode } from "react";
import { createContext, useContext, useMemo } from "react";
import { Policy } from "./types";
import policies from "./policies.json";

const GrantedPoliciesContext = createContext<{
  grantedPolicies: Record<Policy, boolean>;
}>({ grantedPolicies: policies });

export const useGrantedPolicies = () => {
  return useContext(GrantedPoliciesContext);
};

export function GrantedPoliciesProvider({
  children,
  grantedPolicies = policies,
}: {
  children: ReactNode;
  grantedPolicies?: Record<string, boolean> | undefined;
}) {
  const key = useMemo(() => {
    return new Date().getTime().toString();
  }, [grantedPolicies]);
  return (
    <GrantedPoliciesContext.Provider
      key={key}
      value={{ grantedPolicies: grantedPolicies as Record<Policy, boolean> }}
    >
      {children}
    </GrantedPoliciesContext.Provider>
  );
}
