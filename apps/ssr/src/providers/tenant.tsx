"use client";

import {createContext, useContext, useEffect} from "react";
import type {UniRefund_AdministrationService_CountrySettings_CountrySettingInfoDto} from "@ayasofyazilim/saas/AdministrationService";

interface TenantProviderProps {
  children: JSX.Element;
  tenantData: UniRefund_AdministrationService_CountrySettings_CountrySettingInfoDto;
}

export const TenantContext = createContext<UniRefund_AdministrationService_CountrySettings_CountrySettingInfoDto>({
  tenantName: "",
  tenantId: "",
  timeZone: "",
  countryCode2: "",
  countryCode3: "",
  currency: "",
  countryName: "",
});

export const useTenant = () => {
  return useContext(TenantContext);
};

export function TenantProvider(props: TenantProviderProps) {
  useEffect(() => {
    localStorage.setItem("countryCode2", props.tenantData.countryCode2?.toLocaleLowerCase() || "us");
  }, [props.tenantData.countryCode2]);
  return <TenantContext.Provider value={props.tenantData}>{props.children}</TenantContext.Provider>;
}
