"use server";

import type { PostApiLanguageManagementLanguagesData } from "@ayasofyazilim/saas/AdministrationService";
import {
  getAdministrationServiceClient,
  structuredError,
  structuredResponse,
} from "src/lib";

export async function postLanguageApi(
  data: PostApiLanguageManagementLanguagesData,
) {
  try {
    const client = await getAdministrationServiceClient();
    const dataResponse =
      await client.languages.postApiLanguageManagementLanguages(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
