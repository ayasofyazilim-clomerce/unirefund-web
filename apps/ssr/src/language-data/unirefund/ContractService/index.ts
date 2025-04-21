import {getLocalizationResources} from "src/utils";
import type {ContractServiceResources} from "@/language-data/resources";
import defaultEn from "../../core/Default/resources/en.json";
import defaultTr from "../../core/Default/resources/tr.json";
import en from "./resources/en.json";
import tr from "./resources/tr.json";

export type ContractServiceResource = typeof en & typeof defaultEn;
function getLanguageData(lang: string): ContractServiceResource {
  if (lang === "tr") {
    return {
      ...defaultTr,
      ...tr,
    };
  }
  return {
    ...defaultEn,
    ...en,
  };
}
export async function getResourceData(lang: string) {
  const resources = await getLocalizationResources(lang);
  const languageData = getLanguageData(lang);
  return {
    languageData: {
      ...languageData,
      ...(resources.ContractService?.texts as unknown as ContractServiceResources),
    },
  };
}
export function getResourceDataClient(lang: string) {
  const languageData = getLanguageData(lang);
  return languageData;
}
