"use client";

import {createContext, useContext} from "react";

interface ApplicationProviderProps {
  appName: string;
  children: JSX.Element;
}
interface ApplicationContextProps {
  appName: string;
}

export const ApplicationContext = createContext<ApplicationContextProps>({
  appName: "UNIREFUND",
});

export const useApplication = () => {
  return useContext(ApplicationContext);
};

export function ApplicationProvider({children, appName}: ApplicationProviderProps) {
  return <ApplicationContext.Provider value={{appName}}>{children}</ApplicationContext.Provider>;
}
