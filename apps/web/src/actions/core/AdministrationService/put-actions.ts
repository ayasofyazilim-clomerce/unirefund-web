"use server";
import type {
  PutApiLanguageManagementLanguagesByIdData,
  PutApiPermissionManagementPermissionsData,
  UniRefund_AdministrationService_CountrySettings_SetCountrySettingsByListDto,
} from "@ayasofyazilim/saas/AdministrationService";
import {
  getAdministrationServiceClient,
  structuredError,
  structuredResponse,
} from "src/lib";

export async function putPermissionsApi(
  data: PutApiPermissionManagementPermissionsData,
) {
  try {
    const client = await getAdministrationServiceClient();
    const dataResponse =
      await client.permissions.putApiPermissionManagementPermissions(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
export async function putCountrySettingsApi(
  data: UniRefund_AdministrationService_CountrySettings_SetCountrySettingsByListDto,
) {
  try {
    const client = await getAdministrationServiceClient();
    const dataResponse =
      await client.countrySetting.putApiAdministrationServiceCountrySettingsSetValues(
        {
          requestBody: data,
        },
      );
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function putLanguageApi(
  data: PutApiLanguageManagementLanguagesByIdData,
) {
  try {
    const client = await getAdministrationServiceClient();
    const dataResponse =
      await client.languages.putApiLanguageManagementLanguagesById(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function putLanguagesByIdSetAsDefaultApi(id: string) {
  try {
    const client = await getAdministrationServiceClient();
    const dataResponse =
      await client.languages.putApiLanguageManagementLanguagesByIdSetAsDefault({
        id,
      });
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
