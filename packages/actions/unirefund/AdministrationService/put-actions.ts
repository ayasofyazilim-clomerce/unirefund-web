"use server";
import type {UniRefund_AdministrationService_CountrySettings_SetCountrySettingsByListDto} from "@ayasofyazilim/core-saas/AdministrationService";
import {structuredError, structuredResponse} from "@repo/utils/api";
import {getAdministrationServiceClient} from "../lib";

export async function putCountrySettingsApi(
  data: UniRefund_AdministrationService_CountrySettings_SetCountrySettingsByListDto,
) {
  try {
    const client = await getAdministrationServiceClient();
    const dataResponse = await client.countrySetting.putApiAdministrationServiceCountrySettingsSetTenantValues({
      requestBody: data,
    });
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
