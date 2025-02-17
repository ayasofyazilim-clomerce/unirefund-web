"use client";
import {createContext, useContext} from "react";
import policies from "./policies.json";
import {Policy} from "./types";

import type {ReactNode} from "react";
const GrantedPoliciesContext = createContext<{
  grantedPolicies: Record<Policy, boolean>;
}>({grantedPolicies: policies});

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
  return (
    <GrantedPoliciesContext.Provider value={{grantedPolicies: grantedPolicies as Record<Policy, boolean>}}>
      {children}
    </GrantedPoliciesContext.Provider>
  );
}
