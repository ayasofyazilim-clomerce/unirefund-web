"use client";

import type {BreadcrumbReplacement} from "./use-breadcrumb-title";
import { useBreadcrumbTitle} from "./use-breadcrumb-title";

export function BreadcrumbTitle({replacements}: {replacements: BreadcrumbReplacement | BreadcrumbReplacement[]}) {
  useBreadcrumbTitle(replacements);
  return null;
}
