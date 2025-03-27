"use client";
import type {UniRefund_AdministrationService_CountrySettings_CountrySettingDto as CountrySettingDto} from "@ayasofyazilim/saas/AdministrationService";
import {getBaseLink} from "@/utils";
import type {AdministrationServiceResource} from "src/language-data/core/AdministrationService";

export function createTabListFromList(list: CountrySettingDto, languageData: AdministrationServiceResource) {
  return list.groups.map((item) => {
    return {
      label: languageData[item.displayName as keyof typeof languageData] || item.displayName,
      href: getBaseLink(`settings/tenant/${item.key}`),
    };
  });
}

export function manupulatedData(inputObj: object) {
  const result: {key: string; value: string}[] = [];

  // Helper function to traverse nested objects
  function traverseObject(obj: object) {
    for (const key in obj) {
      if (typeof obj[key as keyof typeof obj] === "object") {
        traverseObject(obj[key as keyof typeof obj]); // Recurse if the value is an object
      } else {
        result.push({key, value: (obj[key as keyof typeof obj] as string).toString()});
      }
    }
  }

  traverseObject(inputObj); // Start the traversal from the root object
  return {countrySettings: result};
}
