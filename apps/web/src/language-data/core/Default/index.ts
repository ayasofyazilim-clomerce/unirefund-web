import {getLocalizationResources} from "src/utils";
import en from "./resources/en.json";
import tr from "./resources/tr.json";

export type DefaultResource = typeof en;

function getLanguageData(lang: string): DefaultResource {
  if (lang === "tr") {
    return tr;
  }
  return en;
}
export async function getResourceData(lang: string) {
  const resources = await getLocalizationResources(lang);
  const languageData = getLanguageData(lang);
  return {
    languageData,
    resources,
  };
}
export function getResourceDataClient(lang: string) {
  const languageData = getLanguageData(lang);
  return languageData;
}
