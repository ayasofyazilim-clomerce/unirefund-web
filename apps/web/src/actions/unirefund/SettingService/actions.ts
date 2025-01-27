"use server";
import type {
  GetApiSettingServiceProductGroupData,
  GetApiSettingServiceVatData,
} from "@ayasofyazilim/saas/SettingService";
import type { Session } from "@repo/utils/auth";
import {
  getSettingServiceClient,
  structuredError,
  structuredResponse,
  structuredSuccessResponse,
} from "src/lib";

export async function getProductGroupsApi(
  data: GetApiSettingServiceProductGroupData,
  session?: Session | null,
) {
  try {
    const client = await getSettingServiceClient(session);
    const dataResponse =
      await client.productGroup.getApiSettingServiceProductGroup(data);
    return structuredSuccessResponse(dataResponse);
  } catch (error) {
    throw structuredError(error);
  }
}

//Unupdated actions

export async function getVatsApi(data: GetApiSettingServiceVatData) {
  try {
    const client = await getSettingServiceClient();
    const dataResponse = await client.vat.getApiSettingServiceVat(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
export async function getVatDetailsByIdApi(id: string) {
  try {
    const client = await getSettingServiceClient();
    const dataResponse = await client.vat.getApiSettingServiceVatById({
      id,
    });
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getproductGroupDetailsByIdApi(id: string) {
  try {
    const client = await getSettingServiceClient();
    const dataResponse =
      await client.productGroup.getApiSettingServiceProductGroupById({
        id,
      });
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
