"use server";
import type { NavbarItemsFromDB } from "@repo/ui/theme/types";
import type { AbpUiNavigationResource } from "src/language-data/core/AbpUiNavigation";
import coreNavItems from "./core-navbar-items.json";
import projectNavItems from "./project-navbar-items.json";

const dbData = {
  APP: process.env.APPLICATION_NAME === "CORE" ? coreNavItems : projectNavItems,
};
function buildItemHref(prefix: string, item: NavbarItemsFromDB) {
  return item.href ? `${prefix}/${item.href}` : null;
}

function buildParentKey(prefix: string, item: NavbarItemsFromDB) {
  return item.parentNavbarItemKey === "/"
    ? prefix
    : `${prefix}/${item.parentNavbarItemKey}`;
}

function buildItemKey(prefix: string, item: NavbarItemsFromDB) {
  return item.key && item.key !== "/" ? `${prefix}/${item.key}` : prefix;
}

function getDescription(
  item: NavbarItemsFromDB,
  languageData: AbpUiNavigationResource,
) {
  const descriptionKey =
    `${item.displayName}.Description` as keyof typeof languageData;
  return languageData[descriptionKey] || "No description";
}

function processPolicies(
  item: NavbarItemsFromDB,
  grantedPolicies: Record<string, boolean> | undefined,
) {
  if (item.requiredPolicies) {
    const missingPolicies = item.requiredPolicies.filter(
      (policy) => !grantedPolicies?.[policy],
    );
    if (missingPolicies.length > 0) {
      item.hidden = true;
    }
  }
}

function processNavbarItems(
  items: NavbarItemsFromDB[],
  prefix: string,
  grantedPolicies: Record<string, boolean> | undefined,
  languageData: AbpUiNavigationResource,
) {
  return items.map((item) => {
    processPolicies(item, grantedPolicies);

    item.href = buildItemHref(prefix, item);
    item.parentNavbarItemKey = buildParentKey(prefix, item);
    item.key = buildItemKey(prefix, item);

    item.description = getDescription(item, languageData);

    item.displayName =
      languageData[item.displayName as keyof typeof languageData] ||
      `**${item.displayName}`;

    return item;
  });
}

function checkForChildLink(
  item: NavbarItemsFromDB,
  filteredItems: NavbarItemsFromDB[],
): string | null {
  if (item.href) {
    return item.href;
  }
  const isVisibleChild = filteredItems.find(
    (i) => i.parentNavbarItemKey === item.key,
  );

  if (!isVisibleChild) {
    item.hidden = true;
    return null;
  }

  if (isVisibleChild.href) {
    item.href = isVisibleChild.href;
    return item.href;
  }

  const childHref = checkForChildLink(isVisibleChild, filteredItems);
  if (!childHref) {
    item.hidden = true;
  } else {
    item.href = childHref;
  }
  return item.href;
}

export async function getNavbarFromDB(
  prefix: string,
  languageData: AbpUiNavigationResource,
  grantedPolicies: Record<string, boolean> | undefined,
) {
  await Promise.resolve();
  const navbarDataFromDB: NavbarItemsFromDB[] = JSON.parse(
    JSON.stringify(dbData.APP),
  ) as NavbarItemsFromDB[];

  const processedItems = processNavbarItems(
    navbarDataFromDB,
    prefix,
    grantedPolicies,
    languageData,
  );

  const filteredItems = processedItems.filter((item) => !item.hidden);

  filteredItems
    .filter((item) => item.href === null)
    .forEach((item) => {
      checkForChildLink(item, filteredItems);
    });

  return filteredItems.filter((item) => !item.hidden);
}
