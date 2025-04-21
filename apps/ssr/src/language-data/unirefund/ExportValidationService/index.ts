import {getLocalizationResources} from "src/utils";
import type {ExportValidationServiceResources} from "@/language-data/resources";
import defaultEn from "../../core/Default/resources/en.json";
import defaultTr from "../../core/Default/resources/tr.json";
import en from "./resources/en.json";
import tr from "./resources/tr.json";

export type ExportValidationServiceResource = typeof en & typeof defaultEn;

function getLanguageData(lang: string): ExportValidationServiceResource {
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
      ...(resources.ExportValidationService?.texts as unknown as ExportValidationServiceResources),
    },
  };
}
export function getResourceDataClient(lang: string) {
  const languageData = getLanguageData(lang);
  return languageData;
}
