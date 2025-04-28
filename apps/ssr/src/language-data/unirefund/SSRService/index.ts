import {getLocalizationResources} from "@/utils";
import type {DefaultResource} from "@/language-data/core/Default";
import defaultEn from "../../core/Default/resources/en.json";
import defaultTr from "../../core/Default/resources/tr.json";
import en from "./resources/en.json";
import tr from "./resources/tr.json";

export type SSRServiceResource = typeof en & typeof defaultEn;
function getLanguageData(lang: string): SSRServiceResource {
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
      ...(resources.Default?.texts as unknown as DefaultResource),
    },
  };
}
export function getResourceDataClient(lang: string) {
  const languageData = getLanguageData(lang);
  return languageData;
}
