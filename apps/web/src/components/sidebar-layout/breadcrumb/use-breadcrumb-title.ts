"use client";

import {useEffect, useRef} from "react";
import {useSidebarLayout} from "../provider";

export interface BreadcrumbReplacement {
  /** The value to find and replace (e.g., UUID, segment name) */
  find: string;
  /** The new label to display */
  title: string;
  /** Optional: The href for this breadcrumb */
  href?: string;
}

export function useBreadcrumbTitle(replacements: BreadcrumbReplacement | BreadcrumbReplacement[]) {
  const {breadcrumbs, updateBreadcrumbs} = useSidebarLayout();
  const lastUpdateRef = useRef<string>();

  useEffect(() => {
    if (breadcrumbs.length <= 1) {
      return;
    }

    // Normalize to array
    const replacementArray = Array.isArray(replacements) ? replacements : [replacements];

    // Create update key to prevent unnecessary updates
    const updateKey = JSON.stringify(replacementArray);
    if (lastUpdateRef.current === updateKey) {
      return;
    }

    lastUpdateRef.current = updateKey;

    // Apply replacements
    const updatedBreadcrumbs = breadcrumbs.map((crumb) => {
      // Check if this breadcrumb matches any replacement
      const replacement = replacementArray.find(
        (r) => crumb.label === r.find || crumb.label.includes(r.find) || crumb.href?.includes(r.find),
      );

      if (replacement) {
        return {
          label: replacement.title,
          href: replacement.href,
        };
      }

      return crumb;
    });

    updateBreadcrumbs(updatedBreadcrumbs);
  }, [replacements, breadcrumbs, updateBreadcrumbs]);
}
