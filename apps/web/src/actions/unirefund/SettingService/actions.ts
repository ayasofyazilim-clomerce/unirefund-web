"use server";
import type {
  GetApiSettingServiceProductGroupData,
  GetApiSettingServiceVatData,
} from "@ayasofyazilim/saas/SettingService";
import {
  getSettingServiceClient,
  structuredError,
  structuredResponse,
} from "src/lib";

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
export async function getProductGroupsApi(
  data: GetApiSettingServiceProductGroupData,
) {
  try {
    const client = await getSettingServiceClient();
    const dataResponse =
      await client.productGroup.getApiSettingServiceProductGroup(data);
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
