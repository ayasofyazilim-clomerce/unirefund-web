"use client";

import {createContext, useContext} from "react";
import type {UniRefund_AdministrationService_CountrySettings_CountrySettingInfoDto} from "@ayasofyazilim/saas/AdministrationService";

interface TenantProviderProps {
  children: JSX.Element;
  tenantData: UniRefund_AdministrationService_CountrySettings_CountrySettingInfoDto;
}

export const TenantContext = createContext<UniRefund_AdministrationService_CountrySettings_CountrySettingInfoDto>({
  tenantName: "",
  tenantId: "",
  timeZone: "",
  countryCode3: "",
  currency: "",
  countryName: "",
});

export const useTenant = () => {
  return useContext(TenantContext);
};

export function TenantProvider(props: TenantProviderProps) {
  return <TenantContext.Provider value={props.tenantData}>{props.children}</TenantContext.Provider>;
}
