import type { Volo_Abp_AspNetCore_Mvc_ApplicationConfigurations_ApplicationLocalizationDto } from "@ayasofyazilim/saas/AccountService";

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
    return (
      (
        (await response.json()) as Volo_Abp_AspNetCore_Mvc_ApplicationConfigurations_ApplicationLocalizationDto
      ).resources || {}
    );
  } catch (error) {
    return { texts: { texts: { languageCode } } };
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
