"use server";

import type {DeleteApiFeatureManagementFeaturesData} from "@ayasofyazilim/core-saas/AdministrationService";
import {structuredError, structuredResponse} from "@repo/utils/api";
import {getAdministrationServiceClient} from "src/lib";

export async function deleteLanguageByIdApi(id: string) {
  try {
    const client = await getAdministrationServiceClient();
    const dataResponse = await client.languages.deleteApiLanguageManagementLanguagesById({
      id,
    });
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function deleteFeaturesApi(data: DeleteApiFeatureManagementFeaturesData) {
  try {
    const client = await getAdministrationServiceClient();
    const dataResponse = await client.features.deleteApiFeatureManagementFeatures(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
