import {getLocalizationResources} from "src/utils";
import type {AdministrationServiceResources} from "@/language-data/resources";
import defaultEn from "../Default/resources/en.json";
import defaultTr from "../Default/resources/tr.json";
import en from "./resources/en.json";
import tr from "./resources/tr.json";

export type AdministrationServiceResource = typeof en & typeof defaultEn;
function getLanguageData(lang: string): AdministrationServiceResource {
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
      ...(resources.AdministrationService?.texts as unknown as AdministrationServiceResources),
    },
  };
}
export function getResourceDataClient(lang: string) {
  const languageData = getLanguageData(lang);
  return languageData;
}
