"use server";

import type {PostApiLanguageManagementLanguagesData} from "@ayasofyazilim/core-saas/AdministrationService";
import {structuredError, structuredResponse} from "@repo/utils/api";
import {getAdministrationServiceClient} from "../lib";

export async function postLanguageApi(data: PostApiLanguageManagementLanguagesData) {
  try {
    const client = await getAdministrationServiceClient();
    const dataResponse = await client.languages.postApiLanguageManagementLanguages(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
