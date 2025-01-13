"use client";
import { toast } from "@/components/ui/sonner";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ServerResponse } from "./types";

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
      const { prefix, suffix, identifier } = redirectTo;
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
