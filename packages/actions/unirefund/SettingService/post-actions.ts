"use server";

import type {
  PostApiSettingServiceProductGroupData,
  PostApiSettingServiceVatData,
} from "@ayasofyazilim/saas/SettingService";
import {structuredResponse, structuredError} from "@repo/utils/api";
import {getSettingServiceClient} from "../lib";

export async function postVatApi(data: PostApiSettingServiceVatData) {
  try {
    const client = await getSettingServiceClient();
    const dataResponse = await client.vat.postApiSettingServiceVat(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
export async function postProductGroupApi(data: PostApiSettingServiceProductGroupData) {
  try {
    const client = await getSettingServiceClient();
    const dataResponse = await client.productGroup.postApiSettingServiceProductGroup(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
