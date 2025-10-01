"use client";

import type { UniRefund_AdministrationService_CountrySettings_CountrySettingInfoDto } from "@ayasofyazilim/saas/AdministrationService";
import { createContext, useContext, useEffect } from "react";

export type Localization = { locale: string; timeZone: string; lang: string };
type TenantData = UniRefund_AdministrationService_CountrySettings_CountrySettingInfoDto & {
  localization: { locale: string; timeZone: string; lang: string };
};
interface TenantProviderProps {
  children: JSX.Element;
  tenantData: UniRefund_AdministrationService_CountrySettings_CountrySettingInfoDto;
  lang: string;
}

export const TenantContext = createContext<TenantData>({
  tenantName: "",
  tenantId: "",
  timeZone: "",
  localization: { locale: "", timeZone: "", lang: "en" },
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
  return (
    <TenantContext.Provider
      value={{
        ...props.tenantData,
        localization: {
          locale: getLocaleFromCountryCode(props.tenantData.countryCode2 || "UK"),
          timeZone: props.tenantData.timeZone || "UTC",
          lang: props.lang,
        },
      }}>
      {props.children}
    </TenantContext.Provider>
  );
}

const countryToLocale = {
  GB: "en-GB",
  US: "en-US",
  IE: "en-IE",
  TR: "tr-TR",
  DE: "de-DE",
};

function getLocaleFromCountryCode(code2: string) {
  const upperCode = code2.toUpperCase();
  return upperCode in countryToLocale ? countryToLocale[upperCode as keyof typeof countryToLocale] : "en-UK";
}