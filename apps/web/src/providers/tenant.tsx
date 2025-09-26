"use client";

import {createContext, useContext, useEffect} from "react";
import {findIana} from "windows-iana";

export type CountrySettingsInfo = {
  tenantId?: string | null;
  tenantName?: string | null;
  timeZone?: string | null;
  currency?: string | null;
  countryCode2?: string | null;
  countryCode3?: string | null;
  countryName?: string | null;
};
const defaultTenantData: CountrySettingsInfo = {
  tenantId: "df64152b-9f76-e06b-d43f-3a1bd9644ea9",
  tenantName: "Türkiye",
  timeZone: "Turkey Standard Time",
  currency: "TRY",
  countryCode2: "TR",
  countryCode3: "TUR",
  countryName: "Türkiye",
};
export type Localization = {locale: string; timeZone: string; lang: string};
type TenantData = CountrySettingsInfo & {
  localization: {locale: string; timeZone: string; lang: string};
};
interface TenantProviderProps {
  children: JSX.Element;
  lang: string;
}

export const TenantContext = createContext<TenantData>({
  ...defaultTenantData,
  localization: {locale: "", timeZone: "", lang: "en"},
});

export const useTenant = () => {
  return useContext(TenantContext);
};

export function TenantProvider(props: TenantProviderProps) {
  useEffect(() => {
    localStorage.setItem("countryCode2", defaultTenantData.countryCode2?.toLocaleLowerCase() || "us");
  }, [defaultTenantData.countryCode2]);
  return (
    <TenantContext.Provider
      value={{
        ...defaultTenantData,
        localization: {
          locale: getLocaleFromCountryCode(defaultTenantData.countryCode2 || "GB"),
          timeZone: findIana(defaultTenantData.timeZone || "UTC")[0] || "UTC",
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
