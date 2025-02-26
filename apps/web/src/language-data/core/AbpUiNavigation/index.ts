import {getLocalizationResources} from "src/utils";
import type {AbpUiNavigationResources} from "@/language-data/resources";
import defaultEn from "../Default/resources/en.json";
import defaultTr from "../Default/resources/tr.json";
import en from "./resources/en.json";
import tr from "./resources/tr.json";

export type AbpUiNavigationResource = typeof en & typeof defaultEn;

function getLanguageData(lang: string): AbpUiNavigationResource {
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
      ...(resources.AbpUiNavigation?.texts as unknown as AbpUiNavigationResources),
    },
  };
}
export function getResourceDataClient(lang: string) {
  const languageData = getLanguageData(lang);
  return languageData;
}
