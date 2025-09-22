"use server";
import { structuredError, structuredSuccessResponse } from "@repo/utils/api";
import type { Session } from "next-auth";
import { getAdministrationServiceClient } from "../lib";
export async function getInfoForCurrentTenantApi(session?: Session | null) {
  try {
    const client = await getAdministrationServiceClient(session);
    const dataResponse =
      await client.countrySettingPublic.getApiAdministrationServicePublicCountrySettingsInfoForCurrentTenant();
    return structuredSuccessResponse(dataResponse);
  } catch (error) {
    throw structuredError(error);
  }
}

export async function getCountrySettingsApi() {
  const api_client = await getAdministrationServiceClient();
  try {
    const response = await api_client.countrySetting.getApiAdministrationServiceCountrySettings();
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
