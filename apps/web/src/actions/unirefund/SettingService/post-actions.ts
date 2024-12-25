"use server";

import type {
  PostApiSettingServiceProductGroupData,
  PostApiSettingServiceVatData,
} from "@ayasofyazilim/saas/SettingService";
import {
  getSettingServiceClient,
  structuredError,
  structuredResponse,
} from "src/lib";

export async function postVatApi(data: PostApiSettingServiceVatData) {
  try {
    const client = await getSettingServiceClient();
    const dataResponse = await client.vat.postApiSettingServiceVat(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
export async function postProductGroupApi(
  data: PostApiSettingServiceProductGroupData,
) {
  try {
    const client = await getSettingServiceClient();
    const dataResponse =
      await client.productGroup.postApiSettingServiceProductGroup(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
