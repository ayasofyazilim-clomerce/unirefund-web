"use client";

import type {Volo_Abp_AspNetCore_Mvc_ApplicationConfigurations_ApplicationLocalizationResourceDto} from "@ayasofyazilim/core-saas/AccountService";
import {createContext, useContext} from "react";
import type {ResourceResult} from "src/utils";

type ResourceDto = Volo_Abp_AspNetCore_Mvc_ApplicationConfigurations_ApplicationLocalizationResourceDto;
type ResourcesProps = Record<string, ResourceDto> | ResourceResult;
interface LocaleProviderProps {
  resources: ResourcesProps;
  children: JSX.Element;
  lang: string;
}
interface LocaleContextProps {
  changeLocale?: (_cultureName: string) => void;
  resources: ResourcesProps;
  cultureName: string | undefined;
}

export const LocaleContext = createContext<LocaleContextProps>({
  cultureName: undefined,
  resources: {},
});

export const useLocale = () => {
  return useContext(LocaleContext);
};

export function LocaleProvider({children, lang, resources}: LocaleProviderProps) {
  function changeLocale(cultureName: string) {
    if (!cultureName) return;
    location.href = `/${cultureName}/${location.pathname.split("/").slice(2).join("/")}/${location.search}`;
  }
  const providerValue = {resources, cultureName: lang, changeLocale};
  return <LocaleContext.Provider value={providerValue}>{children}</LocaleContext.Provider>;
}
