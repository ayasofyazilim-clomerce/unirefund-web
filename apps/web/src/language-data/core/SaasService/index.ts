import { getLocalizationResources } from "src/utils";
import defaultEn from "../Default/resources/en.json";
import defaultTr from "../Default/resources/tr.json";
import en from "./resources/en.json";
import tr from "./resources/tr.json";

export type SaasServiceResource = typeof en & typeof defaultEn;
function getLanguageData(lang: string): SaasServiceResource {
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
    languageData,
    resources,
  };
}
export function getResourceDataClient(lang: string) {
  const languageData = getLanguageData(lang);
  return languageData;
}
