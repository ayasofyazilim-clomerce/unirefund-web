import { notFound, permanentRedirect, RedirectType } from "next/navigation";
import type { ServerResponse } from "src/lib";
import type policies from "./policies.json";

export type Policy = keyof typeof policies;

export function isErrorOnRequest<T>(
  response: ServerResponse<T>,
  lang: string,
  redirectToNotFound = true,
): response is
  | { type: "api-error"; message: string; status: number; data: string }
  | { type: "error"; message: string; status: number; data: unknown } {
  if (response.type === "success") return false;

  if (response.data === "Forbidden") {
    return permanentRedirect(`/${lang}/unauthorized`, RedirectType.replace);
  }

  if (redirectToNotFound) {
    return notFound();
  }
  return true;
}
