"use server";

import {
  getAdministrationServiceClient,
  structuredError,
  structuredResponse,
} from "src/lib";

export async function deleteLanguageByIdApi(id: string) {
  try {
    const client = await getAdministrationServiceClient();
    const dataResponse =
      await client.languages.deleteApiLanguageManagementLanguagesById({
        id,
      });
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
