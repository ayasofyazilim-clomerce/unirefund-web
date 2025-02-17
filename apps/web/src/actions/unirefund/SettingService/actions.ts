"use server";
import type {
  GetApiSettingServiceProductGroupData,
  GetApiSettingServiceVatData,
} from "@ayasofyazilim/saas/SettingService";
import {structuredError, structuredSuccessResponse} from "@repo/utils/api";
import type {Session} from "@repo/utils/auth";
import {getSettingServiceClient} from "src/lib";

export async function getVatsApi(data: GetApiSettingServiceVatData, session?: Session | null) {
  try {
    const client = await getSettingServiceClient(session);
    const dataResponse = await client.vat.getApiSettingServiceVat(data);
    return structuredSuccessResponse(dataResponse);
  } catch (error) {
    throw structuredError(error);
  }
}

export async function getProductGroupsApi(data: GetApiSettingServiceProductGroupData, session?: Session | null) {
  try {
    const client = await getSettingServiceClient(session);
    const dataResponse = await client.productGroup.getApiSettingServiceProductGroup(data);
    return structuredSuccessResponse(dataResponse);
  } catch (error) {
    throw structuredError(error);
  }
}

export async function getVatDetailsByIdApi(id: string, session?: Session | null) {
  try {
    const client = await getSettingServiceClient(session);
    const dataResponse = await client.vat.getApiSettingServiceVatById({
      id,
    });
    return structuredSuccessResponse(dataResponse);
  } catch (error) {
    throw structuredError(error);
  }
}

export async function getproductGroupDetailsByIdApi(id: string, session?: Session | null) {
  try {
    const client = await getSettingServiceClient(session);
    const dataResponse = await client.productGroup.getApiSettingServiceProductGroupById({
      id,
    });
    return structuredSuccessResponse(dataResponse);
  } catch (error) {
    throw structuredError(error);
  }
}

export async function getTimeZoneApi(session?: Session | null) {
  try {
    const client = await getSettingServiceClient(session);
    const response = await client.timeZoneSettings.getApiSettingManagementTimezoneTimezones();
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
