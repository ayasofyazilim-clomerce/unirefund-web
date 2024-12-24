"use server";

import type {
  PostApiAccountMyProfileChangePasswordData,
  PostApiAccountProfilePictureData,
} from "@ayasofyazilim/saas/AccountService";
import {
  getAccountServiceClient,
  structuredError,
  structuredResponse,
} from "src/lib";

export async function postPasswordChangeApi(
  data: PostApiAccountMyProfileChangePasswordData,
) {
  try {
    const client = await getAccountServiceClient();
    const dataResponse =
      await client.profile.postApiAccountMyProfileChangePassword(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function postProfilePictureApi(
  data: PostApiAccountProfilePictureData,
) {
  try {
    const client = await getAccountServiceClient();
    const dataResponse =
      await client.account.postApiAccountProfilePicture(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
