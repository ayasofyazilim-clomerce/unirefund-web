"use client"

import { AbpUiNavigationResource } from '@/language-data/core/AbpUiNavigation';
import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import type { NavItem } from './data';

export interface Breadcrumb {
    label: string;
    href?: string;
}

interface SidebarLayoutContextValue {
    breadcrumbs: Breadcrumb[];
    updateBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;
    setBreadcrumbsFromPath: (path: string) => void;
    addBreadcrumb: (breadcrumb: Breadcrumb) => void;
    resetBreadcrumbs: () => void;
}

interface SidebarLayoutProviderProps {
    children: ReactNode;
    navItems: NavItem[];
    defaultBreadcrumbs?: Breadcrumb[];
    languageData: AbpUiNavigationResource
}

const SidebarLayoutContext = createContext<SidebarLayoutContextValue | undefined>(undefined);

/**
 * Normalizes a path by ensuring it starts with / and removing duplicate slashes
 */
function normalizePath(path: string): string {
    return `/${path}`.replace(/^\/+/, '/');
}

/**
 * Checks if a segment is a UUID
 */
function isUUID(segment: string): boolean {
    return /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i.test(segment.replace(/\s/g, ''));
}

/**
 * Checks if a segment looks like a locale (e.g., 'en', 'tr', 'en-US')
 */
function isLocaleSegment(segment: string): boolean {
    return /^[a-z]{2}(?<region>-[A-Z]{2})?$/i.test(segment);
}

/**
 * Recursively finds the navigation path for a given href or key
 * Returns the deepest matching path
 */
function findNavPath(items: NavItem[], targetPath: string, currentPath: NavItem[] = []): NavItem[] | null {
    let bestMatch: NavItem[] | null = null;
    let bestMatchLength = 0;

    for (const item of items) {
        const newPath = [...currentPath, item];

        // Normalize paths for comparison
        const itemHref = item.href ? normalizePath(item.href) : null;
        const itemKey = normalizePath(item.key);
        const normalizedTarget = normalizePath(targetPath);

        // Check exact matches first
        if (itemHref === normalizedTarget || itemKey === normalizedTarget) {
            return newPath;
        }

        // Check if target path starts with this item's path
        const pathMatches = (itemHref && normalizedTarget.startsWith(itemHref)) ||
            normalizedTarget.startsWith(itemKey);

        if (pathMatches) {
            const matchLength = itemHref ? itemHref.length : itemKey.length;
            if (matchLength > bestMatchLength) {
                bestMatch = newPath;
                bestMatchLength = matchLength;
            }
        }

        // Recursively search in nested items
        if (item.items && item.items.length > 0) {
            const found = findNavPath(item.items, targetPath, newPath);
            if (found) {
                // Calculate match length for nested result
                const lastItem = found[found.length - 1];
                const foundHref = lastItem.href ? normalizePath(lastItem.href) : null;
                const foundKey = normalizePath(lastItem.key);

                if (foundHref === normalizedTarget || foundKey === normalizedTarget) {
                    return found; // Exact match in nested items
                }

                const foundMatchLength = foundHref ? foundHref.length : foundKey.length;
                if (foundMatchLength > bestMatchLength) {
                    bestMatch = found;
                    bestMatchLength = foundMatchLength;
                }
            }
        }
    }

    return bestMatch;
}

/**
 * Converts NavItem array to Breadcrumb array
 */
function navItemsToBreadcrumbs(navItems: NavItem[], languageData: AbpUiNavigationResource): Breadcrumb[] {
    return navItems.map(item => ({
        label: languageData[item.displayName],
        href: item.href ? normalizePath(item.href) : undefined
    }));
}

/**
 * Processes segments and creates breadcrumbs from them
 */
function createBreadcrumbsFromSegments(
    segments: string[],
    languageData: AbpUiNavigationResource,
    baseSegments: string[] = []
): Breadcrumb[] {
    const breadcrumbs: Breadcrumb[] = [];

    for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        const href = '/' + [...baseSegments, ...segments.slice(0, i + 1)].join('/');
        const hasTranslate = Boolean(languageData[segment as keyof AbpUiNavigationResource]);
        const label = hasTranslate ? languageData[segment as keyof AbpUiNavigationResource] : segment;

        breadcrumbs.push({
            label: isUUID(segment) ? segment : label,
            href: i < segments.length - 1 ? href : undefined
        });
    }

    return breadcrumbs;
}

export function SidebarLayoutProvider({
    children,
    navItems,
    defaultBreadcrumbs,
    languageData,
}: SidebarLayoutProviderProps) {
    const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>(
        defaultBreadcrumbs || [{ label: 'Home', href: '/' }]
    );

    const updateBreadcrumbs = useCallback((newBreadcrumbs: Breadcrumb[]) => {
        setBreadcrumbs(newBreadcrumbs);
    }, []);

    const setBreadcrumbsFromPath = useCallback((path: string) => {
        // Remove leading/trailing slashes and clean the path
        const cleanPath = path.replace(/^\/|\/$/g, '');
        const segments = cleanPath.split('/').filter(Boolean);

        // Filter out locale segments
        const filteredSegments = segments.filter(seg => !isLocaleSegment(seg));
        const basePathForNav = filteredSegments.join('/');

        // Try to find the best matching navigation path
        const navPath = findNavPath(navItems, basePathForNav);

        if (navPath) {
            // Start with nav-based breadcrumbs
            const generatedBreadcrumbs = navItemsToBreadcrumbs(navPath, languageData);

            // Add remaining dynamic segments if any
            const lastNavItem = navPath[navPath.length - 1];
            const lastNavHref = lastNavItem.href?.replace(/^\/|\/$/g, '');

            if (lastNavHref) {
                const navSegments = lastNavHref.split('/').filter(Boolean);
                const remainingSegments = filteredSegments.slice(navSegments.length);

                if (remainingSegments.length > 0) {
                    const dynamicBreadcrumbs = createBreadcrumbsFromSegments(
                        remainingSegments,
                        languageData,
                        navSegments
                    );
                    generatedBreadcrumbs.push(...dynamicBreadcrumbs);
                }
            }

            setBreadcrumbs(generatedBreadcrumbs);
        } else {
            // Complete fallback: create breadcrumbs from URL segments
            const fallbackBreadcrumbs: Breadcrumb[] = [
                { label: 'Home', href: '/' }
            ];

            const segmentBreadcrumbs = createBreadcrumbsFromSegments(
                filteredSegments,
                languageData
            );
            fallbackBreadcrumbs.push(...segmentBreadcrumbs);

            setBreadcrumbs(fallbackBreadcrumbs);
        }
    }, [navItems, languageData]);

    const addBreadcrumb = useCallback((breadcrumb: Breadcrumb) => {
        setBreadcrumbs(prev => [...prev, breadcrumb]);
    }, []);

    const resetBreadcrumbs = useCallback(() => {
        setBreadcrumbs(defaultBreadcrumbs || [{ label: 'Home', href: '/' }]);
    }, [defaultBreadcrumbs]);

    const contextValue = useMemo(
        () => ({
            breadcrumbs,
            updateBreadcrumbs,
            setBreadcrumbsFromPath,
            addBreadcrumb,
            resetBreadcrumbs
        }),
        [breadcrumbs, updateBreadcrumbs, setBreadcrumbsFromPath, addBreadcrumb, resetBreadcrumbs]
    );

    return (
        <SidebarLayoutContext.Provider value={contextValue}>
            {children}
        </SidebarLayoutContext.Provider>
    );
}

export function useSidebarLayout(): SidebarLayoutContextValue {
    const context = useContext(SidebarLayoutContext);
    if (context === undefined) {
        throw new Error('useSidebarLayout must be used within a SidebarLayoutProvider');
    }
    return context;
}