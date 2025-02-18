"use client";

import {createContext, useContext} from "react";

interface TenantProviderProps extends TenantContextProps {
  children: JSX.Element;
}
interface TenantContextProps {
  tenantName?: string;
  tenantId?: string;
  countryCode?: string;
  phoneCode?: string;
  currency?: string;
  timezone?: string;
}

export const TenantContext = createContext<TenantContextProps>({
  tenantName: "",
  tenantId: "",
  countryCode: "",
  phoneCode: "",
  currency: "",
});

export const useTenant = () => {
  return useContext(TenantContext);
};

export function TenantProvider(props: TenantProviderProps) {
  return <TenantContext.Provider value={props}>{props.children}</TenantContext.Provider>;
}
