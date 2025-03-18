"use server";

import type {PutApiAccountMyProfileData} from "@ayasofyazilim/core-saas/AccountService";
import {structuredError, structuredResponse} from "@repo/utils/api";
import {getAccountServiceClient} from "../lib";

export async function putPersonalInfomationApi(data: PutApiAccountMyProfileData) {
  try {
    const client = await getAccountServiceClient();
    const dataResponse = await client.profile.putApiAccountMyProfile(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
