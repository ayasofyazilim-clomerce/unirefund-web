import { notFound, permanentRedirect, RedirectType } from "next/navigation";
import type { ServerResponse } from "src/lib";

export function isErrorOnRequest<T>(
  response: ServerResponse<T>,
  lang: string,
): response is
  | { type: "api-error"; message: string; status: number; data: string }
  | { type: "error"; message: string; status: number; data: unknown } {
  if (response.type === "success") return false;

  if (response.data === "Forbidden") {
    return permanentRedirect(`/${lang}/unauthorized`, RedirectType.replace);
  }

  return notFound();
}
