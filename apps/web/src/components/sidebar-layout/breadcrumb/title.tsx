"use client"

import { BreadcrumbReplacement, useBreadcrumbTitle } from "./use-breadcrumb-title";


export function BreadcrumbTitle({
    replacements
}: {
    replacements: BreadcrumbReplacement | BreadcrumbReplacement[];
}) {
    useBreadcrumbTitle(replacements);
    return null;
}