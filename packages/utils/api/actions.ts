import { notFound, permanentRedirect, RedirectType } from "next/navigation";
import { isApiError } from "./client-utils";
import { ApiErrorServerResponse, ServerResponse } from "./types";

export function structuredError(error: unknown): ApiErrorServerResponse {
  if (isApiError(error)) {
    const body = error.body as
      | {
          error: { message?: string; details?: string };
        }
      | undefined;
    const errorDetails = body?.error || {};
    return {
      type: "api-error",
      data: errorDetails.message || error.statusText || "Something went wrong",
      message:
        errorDetails.details ||
        errorDetails.message ||
        error.statusText ||
        "Something went wrong",
    };
  }
  return {
    type: "api-error",
    message: "[Unknown] Something went wrong",
    data: "[Unknown] Something went wrong",
  };
}

export function structuredResponse<T>(data: T): ServerResponse<T> {
  return {
    type: "success",
    data,
    message: "",
  };
}

export function isErrorOnRequest<T>(
  response: ServerResponse<T>,
  lang: string,
  redirectToNotFound = true,
): response is {
  type: "api-error";
  message: string;
  data: string;
} {
  if (response.type === "success") return false;

  if (response.data === "Forbidden") {
    return permanentRedirect(`/${lang}/unauthorized`, RedirectType.replace);
  }

  if (redirectToNotFound) {
    return notFound();
  }
  return true;
}

export function structuredSuccessResponse<T>(data: T) {
  return {
    type: "success" as const,
    data,
    message: "",
  };
}