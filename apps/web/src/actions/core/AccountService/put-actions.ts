"use server";

import type {PutApiAccountMyProfileData} from "@ayasofyazilim/saas/AccountService";
import {getAccountServiceClient, structuredError, structuredResponse} from "src/lib";

export async function putPersonalInfomationApi(data: PutApiAccountMyProfileData) {
  try {
    const client = await getAccountServiceClient();
    const dataResponse = await client.profile.putApiAccountMyProfile(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
