"use client";

import type {Dispatch, ReactNode, SetStateAction} from "react";
import {createContext, useContext, useState} from "react";

const configurationContext = createContext<{
  config?: string | undefined;
  setConfig?: Dispatch<SetStateAction<string | undefined>>;
}>({});

export const useConfig = () => {
  return useContext(configurationContext);
};

export function ConfigProvider({children}: {children: ReactNode}) {
  const [config, setConfig] = useState<string | undefined>("test");

  return <configurationContext.Provider value={{config, setConfig}}>{children}</configurationContext.Provider>;
}
