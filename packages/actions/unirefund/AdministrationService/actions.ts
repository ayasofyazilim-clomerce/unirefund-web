"use server";
import {structuredError, structuredResponse, structuredSuccessResponse} from "@repo/utils/api";
import type {Session} from "next-auth";
import {getAdministrationServiceClient} from "../lib";

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
  try {
    const client = await getAdministrationServiceClient();
    const dataResponse = await client.countrySetting.getApiAdministrationServiceCountrySettings();
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
