"use client";
import { ApiError } from "@ayasofyazilim/core-saas/AccountService";
import { notFound, permanentRedirect, RedirectType } from "next/navigation";
import { toast } from "@/components/ui/sonner";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ApiErrorServerResponse, ServerResponse } from "./types";

export const handlePutResponse = (
  response: { type: "success" | "api-error"; message: string },
  router?: AppRouterInstance,
  redirectTo?: string,
) => {
  if (response.type === "success") {
    toast.success("Updated successfully");
    if (!router) return;
    if (redirectTo) {
      router.push(redirectTo);
    }
    router.refresh();
  } else {
    toast.error(response.message);
  }
};

export const handlePostResponse = <T>(
  response: ServerResponse<T>,
  router?: AppRouterInstance,
  redirectTo?:
    | string
    | { prefix: string; identifier: keyof T; suffix?: string },
) => {
  if (response.type === "success") {
    toast.success("Created successfully");
    if (!router) return;
    if (typeof redirectTo === "string") {
      router.push(redirectTo);
    } else if (redirectTo) {
      const { prefix, suffix = "", identifier } = redirectTo;
      const id = (response.data[identifier] as string).toString();
      router.push(`${prefix}/${id}/${suffix}`);
    }
    router.refresh();
  } else {
    toast.error(response.message);
  }
};
export const handleDeleteResponse = (
  response: { type: "success" | "error" | "api-error"; message: string },
  router?: AppRouterInstance,
  redirectTo?: string,
) => {
  if (response.type === "success") {
    toast.success("Deleted successfully");
    if (!router) return;
    if (redirectTo) {
      router.push(redirectTo);
    }
    router.refresh();
  } else {
    toast.error(response.message);
  }
};
export const handleGetResponseError = (response: {
  type: "success" | "error" | "api-error";
  message: string;
}) => {
  if (response.type !== "success") {
    toast.error(response.message);
  }
};

export function isApiError(error: unknown): error is ApiError {
  if ((error as ApiError).name === "ApiError") {
    return true;
  }
  return error instanceof ApiError;
}

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
