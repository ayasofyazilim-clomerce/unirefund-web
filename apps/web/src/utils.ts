import type { Volo_Abp_AspNetCore_Mvc_ApplicationConfigurations_ApplicationLocalizationDto } from "@ayasofyazilim/saas/AccountService";

type LocalizationDto =
  Volo_Abp_AspNetCore_Mvc_ApplicationConfigurations_ApplicationLocalizationDto;
export type ResourcesDto = LocalizationDto["resources"];

type En = Record<string, string>;
type Other = Record<string, string | undefined> | undefined;
export interface LanguageDataType {
  en: En;
  [key: string]: Other;
}

export function isServerSide() {
  return typeof window === "undefined";
}

export type ResourceResult = Record<
  string,
  | {
      texts?: Record<string, string> | null | undefined;
      baseResources?: string[] | null | undefined;
    }
  | undefined
>;

export async function getLocalizationResources(
  languageCode: string,
): Promise<ResourceResult> {
  try {
    const response = await fetch(
      `http://${process.env.HOSTNAME}:${process.env.PORT}/api/?lang=${languageCode}`,
    );
    return ((await response.json()) as LocalizationDto).resources || {};
  } catch (error) {
    return {};
  }
}

export function getBaseLink(location: string, locale?: string) {
  if (isServerSide()) {
    return `/${locale || "en"}/${location}`;
  }
  const pathname = window.location.pathname;
  const pathnameParts = pathname.split("/");
  return `/${locale || pathnameParts[1] || "en"}/${location}`;
}
